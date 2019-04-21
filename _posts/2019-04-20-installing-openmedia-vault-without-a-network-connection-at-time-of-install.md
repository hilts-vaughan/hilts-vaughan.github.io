---
layout: post
title: Installing OpenMediaVault without a network connection at time of install
date: 2019-04-20 17:17 -0400
comments: true
---

My current media server is running unRAID. While I have some gripes about it (that I won't get into here) it has been running rock solid for quite some time and has serviced all my needs, especially with the Docker container support. I have a backup server in my home as well that I sometimes use for mirroring data, which was running Debian for a while. I wanted to replace it with a flash drive OS and remove the 2TB drive being used as a host OS drive, since I wanted to use it for something else.

Since it was mostly just a `rsnapshot` drone + HDD enclosure for the backup drives, I figured something simpler that could be installed to a flash drive with **some persistence** would do the trick.

The only issue is that my workbench (the backup server has no monitor or keyboard near it) where I service my machines (it has a small monitor + KB mouse combo) had no network cable there yet since I had moved. I didn't really want to install that one at the time since it would be a pain and I was moving soon anyway. With no WiFi card and understanding it would hopefully pick up network config later when I plugged it back in headless later, I decided to try and install it without being connected to the network since it was supposed to be supported.

Well, that's what the Internet claimed. I wouldn't be writing here today though if it was so simple. For the record, life is easier if you just install while connected to a network. But it's not too bad to fix the issues you come up with if you can't, this post is hoping to get people on the same page about that. 

# Installing the system

This is pretty straight-forward. You can install it with the [directions from the site](https://openmediavault.readthedocs.io/en/latest/installation/). There are a few changes that I will list below...

1. **The network detection is going to fail.** This is to be expected. When it tries detecting networks and tries to do DHCP, you can just cancel it. It will warn you that nothing is configured. That's OK.
2. **The network sources for the Debian repos will not be configured properly.** It will warn you to let you know. This will cause issues later, so we will take care of that later. 
3. **You won't get hostname validation.** So make sure the hostname is unique.



If you're like me, you're going getting through the install, reboot and login. Things will appear to be working well, locally with no network. You will then proceed to login via the prompt and verify things look good.

Then, you unplug from the bench and plug into where it's going to live. You load up your workstation and try and hit the host name in your browser, for example like so (where the hostname I picked was _lalafell_) and you would get something like...

![<https://i.redd.it/wuiwo6tk5hwz.jpg>](<https://i.redd.it/wuiwo6tk5hwz.jpg>)

(This is pulled from the web -- it would the hostname of your machine in the error)

And if you try and ping it, you would get...

```bash
[setsuna@setsuna ~]$ ping lalafell
ping: lalafell: Name or service not known
```

It turns out that it won't auto detect the new network cable you plugged in and you have to set it up... ugh.

# Resolving network connectivity

You can solve this using `omv-firstaid`. If you have a monitor and cable, you can just login and run that command and be good to go. Of course, that was a bit trickier without lugging a bunch of crap to my workstation. You can run it headless, just do the following:

1. **Turn on your machine and wait a few minutes to make sure it's good to go.** 
2. Type your username in and hit enter. Then type your password in and hit enter. Do this carefully to ensure you get it right, especially since you can't see feedback (no monitor)
3. Type `omv-firstaid` and hit enter. 
4. Hit "Enter" again after about 5 seconds. The default option is for network connections.
5. Hit "Enter" again. It's selecting an interface.
6. Hit "Enter" again. It'll begin configuring.
7. Wait 1 minute.

Then, you can ping the machine and you will get:

```bash
[setsuna@setsuna ~]$ ping lalafell
PING lalafell (lalafell) 56(84) bytes of data.
64 bytes from lalafell: icmp_seq=1 ttl=64 time=1.84 ms
```

You're good to go. You can do the rest from your workstation.

I figured this out by installing in a VM and then just walking through it in the VM and then reproducing the steps inside of the machine. A bit reckless but for a machine with nothing on it yet this was fine. And it worked out.

# Fix the broken sources from the install process

By default, the source list was not installed right given the current installer I used at the time of writing when done offline. [You can follow this guide to to fix that](https://forum.openmediavault.org/index.php/Thread/5981-Problems-with-sources-list/). This is pretty easy to figure out when you know this is the problem, but how to figure out this is the issue?

You might get something like this...

```bash
Failed to execute command 'export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin; export LANG=C; export DEBIAN_FRONTEND=noninteractive; apt-get --yes --allow-downgrades --allow-change-held-packages --fix-missing --allow-unauthenticated --reinstall install openmediavault-flashmemory 2>&1' with exit code '100': Reading package lists...
```

when trying to install the flash memory plugin like I did. You're going to need to do the above if you get this.  The following [Github issue is also relevant](https://github.com/OpenMediaVault-Plugin-Developers/openmediavault-flashmemory/issues/20). It took me a few queries to get this -- so hopefully this saved you some time.

# Checking everything else out

Be sure to run a system update since I had some updates to get. Not sure if this was due to the lack of network during install or what, but there were some. 

Make sure to check network connectivity is as you wanted.

**That's all I had to do. Smooth overall; just had a couple road bumps. I hope this saves someone some time.**