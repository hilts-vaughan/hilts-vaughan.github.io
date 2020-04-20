---
layout: post
title: Investigating how my local home router is resolving hostnames automatically
date: 2020-04-20 17:17 -0400
comments: true
---

I have a boring standard home router, though it's a bit on the expensive side (Or it was when I got it many years back). It runs AsusWRT and it's the RT-N66U from Asus.

It has a neat feature that automatically resolves hostnames on my local network that I never really thought about. I can do something like:

```bash
ping promathia
```

... and get a response back from a machine on my network that has the name `promathia`. A lot of home routers don't actually work this way and most of them just forward all DNS requests to get their upstream provider. Of course, you could always add these entries to a host file but you would have to manage that static mapping everywhere and that's kind of annoying.

I use this feature on a weekly basis but the thing that bothered me was that I could never set another DNS server in my router configuration page or this feature would break. I'd have been wanting to try out Cloudflare's `1.1.1.1` or Google's resolver because benchmarking showed they were faster in some cases. Unfortunately, this would break the hostname resolution over the entire network when I had tried it. That's when I had realized I had no idea how any of it worked. Given the above change as well, it was clear this was not something like Netbios, Bonjour, or Avahi. Something else was going on. 

Using various tools such as `dig` and `nslookup`, you could verify that the resolution was going to the default gateway to get the answers. The question remaining now was "how"? 

I first actually looked to see if there was something in the DHCP specification to do this, since it seemed logical. I made a bunch of queries to Google including things like "DHCP add hostname" but I could not find anything about the specification doing this. I did find that many implementations did this though, such as Microsoft's [DHCP](https://serverfault.com/a/70922/191979) but I am running mostly Linux systems and I am certainly not running that on the router as far as I could tell. (Are there routers out there that run this?)

I got some other complicated answers like setting up DDNS and `bind` with some [keys](https://wiki.debian.org/DDNS). I remember doing neither of those things and they looked a lot more complicated than some home router setup.

I supposed the first thing to figure out was to understand what was running on the router itself. Luckily, AsusWRT supports `telenet` (which is not super secure, but for this purpose is fine) and I could go into the machine and check it out. I knew of a few DNS packages, so I figured I would go check for those first (some of the answers on Superuser helped me round up some of the items that would be likely)

```bash
admin@RT-N66U:/tmp/home/root# ps | grep dns
  357 nobody    1212 S    dnsmasq --log-async
20032 admin     1620 S    grep dns
```

This reveals that we are running `dnsmasq` for our DNS server and DHCP. So, then the question left remaining was: how is this handled by `dnsmasq`? It turns out if you read the documentation you can find out this happens by default. You can even add a [domain](http://www.thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html) (`--expand-hosts` and friends) to have the hostnames expanded. However, I don't have those settings form what I could tell. The question remaining became _how does this work_? I had some ideas but I would need to read some source code to know for sure.

It turns out the key and simplicity is in how `dnsmasq` does both DNS and DHCP.

## Figuring out how `dnsmasq` would get the hostname and add it to DNS

First of all, let's take a step back and figure out how a hostname would even get to `dnsmasq` in the first place. It is clear that some point you would need to send it and that cannot happen without some kind of network traffic or statically configuring. I certainly did not do the latter and that would defeat the purpose of an automatic process. So then, what else could do it? A multi-cast DNS system for sure, but I had none of those either. 

The answer lies then in the process that happens on every boot of an Internet connected system and the thing that happens when you need to configure your NIC to get access (typically, you could be statically configuring but I only have a handful of those and those work too -- more on that later) That would be DHCP. 

You send your hostname as part of the DHCP process, specifically it's [client option 12](https://www.iana.org/assignments/bootp-dhcp-parameters/bootp-dhcp-parameters.xhtml) and allows you to send this as part of the process. By the way, client options are just pieces of metadata information that are sent as part of the process. I read quite a bit about it -- but there are better explanations online. You're better off reading those. Now, let's remember that `dnsmasq` is a DHCP server and DNS server; that means it has the ability to read out these options. It can also serve DNS query responses.

The next part is understanding the fact that the DHCP protocol does not specify any sort of specification about DNS updates but like the Microsoft DHCP server, you would be free to implement something on top as long as it didn't violate the specification. In this case, adding DNS entries based on the option 12 was looking like a good bet. From here, we had to look at some source code to figure out if that's exactly how it worked though since information on this via the web is kind of vague and you can't get an exact answer. I found a good mirror on [Github here](https://github.com/dnsmasq/dnsmasq) and checked it out that's a bit older but would serve well for the purpose of viewing how things work.

When getting a lease from DHCP (from a client) you can find that the function `lease_update_dns` ([link](https://github.com/dnsmasq/dnsmasq/blob/ce5732e84fc46d7f99c152f736cfb4ef5ec98a01/src/lease.c#L458)) is called and has something like this in the code:

```c
	  if (lease->fqdn)
	    cache_add_dhcp_entry(lease->fqdn, prot, (struct all_addr *)&lease->addr, lease->expires);
	  
	  if (!option_bool(OPT_DHCP_FQDN) && lease->hostname)
	    cache_add_dhcp_entry(lease->hostname, prot, (struct all_addr *)&lease->addr, lease->expires);
```

So, in other words we get the hostname from the lease and add it to some cache. You can dig through the code some more and find that many of the functions are looking through the DHCP cache, such as `check_for_local_domain` ([link](https://github.com/dnsmasq/dnsmasq/blob/ce5732e84fc46d7f99c152f736cfb4ef5ec98a01/src/rfc1035.c#L1262)). This gives you the answer you need -- and that is that it is directly taking those leases that you generated and maintaining the cache from those. Then, the DNS server is using the items in that cache to resolve things. 

The last important to thing to note is that -- unless a client has configured otherwise -- DHCP will provide a DNS server to the client to use. You don't have to use this one to connect to the Internet, though most clients will. `dnsmasq` is a DNS server -- so you when I am told to contact my default gateway for DNS, that would be `dnsmasq` under the hood. This then later forwards to the ISP upstream later. 

That's basically it; there are other interesting things in the implementation (such as how it implements round robin -- which is through the cache get mutating the list internally) but they aren't required to understand how my all in one home router was operating -- it was running a local copy of `dnsmasq` that does most of this heavy lifting already. 

Incidentally, for the things with a static IP (things like my NAS, virtual machine server and others) the reason their hostname resolution works is because I use DHCP reservations on the router instead of on a static IP client. If I had done it on a client, then the hostname would have never have been set as part of the DHCP request (no request would have been sent if I had manually configured the interface all together). Since the static mapping is setup server side, the client will still make a DHCP request per normal and `dnsmasq` will take care of giving it the same IP each time. Win win. [There's other advantages](https://serverfault.com/questions/544619/static-ip-vs-dhcp-reservation) to doing it this way as well.

So, then why did changing the domain server break things? Simple: it was handing out a different DNS server from the local one as part of DHCP. You can verify this easily on Linux at least just looking at your `resolv.conf` briefly:

```bash
touma@setsuna:/tmp/test $ cat /etc/resolv.conf
# Generated by resolvconf
nameserver 192.168.1.1
```

vs.

```bash
touma@setsuna:/tmp/test $ cat /etc/resolv.conf
# Generated by resolvconf
nameserver 1.1.1.1
```

Mystery solved. Maybe someone will have the same question as me in the future and this will bring some answers to them a bit faster. 