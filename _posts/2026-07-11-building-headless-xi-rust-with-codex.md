---
layout: post
title: "Building headless-xi-rust with Codex"
date: 2026-07-11 00:00 -0200
comments: true
bluesky_author_handle: "hilts-vaughan.bsky.social"
bluesky_auto_discover: true
---

> This is a continuation of posts of trying out various AI tools. This piece is for education only. The notes may be very rough.

I wanted to see if Codex could do something a little more interesting than moving a blog theme around. I'm a huge fan of Final Fantasy XI. I'm also a pretty big fan of Final Fantasy XIV as well, having raided multiple tiers and still an active subscriber. Final Fantasy in general, really. I've probably played a few thousand hours on the games since the early 2000s. I've maxed a character on retail and at least one private server:

![alt text](/assets/posts/vaughands.png)

[The ToAU expansion is coming up for HorizonXI](https://www.youtube.com/watch?v=h4bXBqjBRtM) ... so it seemed like it could be fun to do something with Final Fantasy XI leveraging my knowledge of the game and domain to see if I could produce anything interesting. I settled on trying to build a native headless client for talking to the [search server](https://github.com/FFXILevelDown/Packets/tree/main/cache). A lot of the game is documented well since most of the server emulation software is based on [LandSandBoat](https://github.com/LandSandBoat/server) but...

- Private servers are often somewhat closed source and make customizations and use forked clients that have some small changes or run old retail clients.
- The search server itself is documented as existing but there is not a lot of code on how it works specifically. You can find some hints on the Internet and some [other headless client projects](https://github.com/claywar/HeadlessXI) but they all focus on the login and world server, rather than the search server.

I think this strikes a good balance of something that would likely not be easy to materialize if you just gave a bad prompt like "build me a tool to get the list of online players in a final fantasy XI server". However, there is definitely documentation on the web for the game. This means that even though the information could likely be synthesized from the open source implementations around the web it is unlikely that Codex or the GPT model could simply "copy" an existing implementation that works. In other words, we would need at least some sort of famicile of "intelligence" to perform this task where as my [previous attempts]({% post_url 2026-07-09-using-codex-on-this-blog %}) were rather mecahnical in nature.

The final project was [headless-xi-rust](https://github.com/hilts-vaughan/headless-xi-rust), a small Rust library that can query a Final Fantasy XI search server and print the online player list if you wish to just check out the code. This is pretty benign and something that most servers provide through a [web UI of their own anyway](https://horizonxi.com/players). However, they don't usually provide real-time information and don't expose all the features that the search server does.

## Building it out

I started with a rough [specification](https://github.com/hilts-vaughan/headless-xi-rust/blob/main/SPECIFICATION.md). I did some of my own research in advance and wrote some pretty rough notes to get things started. I also needed to find live server with some data to feed it, so I added that as well. We could have also spun up our own service but then we would have to jump through some hoops or have codex figure that out and wire a client to it. This would have likely cost a bunch of tokens and I would have to had to figure out how to automate some sort of desktop. I would like to try that out but since I'm only on Day 2 of trying out external agentic coding, I wanted to keep things simple. As we would find out later, this would actually cost me some time. :)

So, I logged into a Final Fantasy XI server and booted Wireshark to grab a packet dump of `/sea all` to get a live address to feed. I did not provide the packet dump the agent for the initial turn for a few reasons:

- The dump is quite large and I hadn't filtered it out down yet, so I didn't want the agent to have to sort through it
- I didn't think it would use specialized tools to deal with it and it may drag down the performance
  - I was wrong.
- We already have some pretty good reference implementations that ought to be "good enough"

I didn't spend more than perhaps 20 minutes doing that research. I then loaded codex up with GPT5-5 and just fed it the specification. I didn't bother with a planning mode.

The full prompt history can be found in [a checkpoint](https://github.com/hilts-vaughan/headless-xi-rust/blob/main/CHECKPOINT.md) file that I kept. The first run took about 10 minutes and chewed through 35% of the tokens and it didn't look like it was going to get anywhere. We kept getting:

```bash
• Ran scripts/horizon-sea-all.sh --timeout 10
  └ error: I/O error: failed to fill whole buff
```

But Codex gave some good insight:

```markdown
- I found a likely remaining protocol issue: LandSandBoat’s Blowfish key schedule uses a signed-byte quirk that the standard RustCrypto blowfish crate does
  not reproduce. The next step is a small compatibility Blowfish implementation or vendored crypto adapter matching LandSandBoat exactly.
```

Well, to be honest I probably would not have noticed this. I flipped through the code really quick and decided I had nothing to lose by letting it try. Some churning later and we got;

```markdown
└ error: invalid packet: unknown search entry 0xf
```

At this point, Codex was stumped a bit. I could have let it churn for a bit and it may have been able to figure it out but it was not able to looking at the dump. But Horizon should be using the same layout as retail, at least in theory. Well, remember how I said that often the private servers are using forks and old clients? [For Horizon, this would be AirSkyBoat and it's not even completely open source](https://github.com/AirSkyBoat/AirSkyBoat/blob/staging/src/search/packets/search_list.cpp). I peaked at some of the search handler code and it did not look like it had changed much.

This is a bit unfortunate because as a human I was able to look at the hex dump and see some of the contents were there and the alignment was just bad:

```markdown
• Horizon’s search list is record-based at the same header offset, but the per-record bit layout does not match current LandSandBoat’s
CSearchListPacket::AddPlayer. I’m comparing repeated records now to infer enough of the Horizon layout to at least extract character names.

• Ran python3 - <<'PY'
│ hexs='d7 03 00 00 49 58 46 46 c3 03 00 80 00 00 ff 07 00 00 00 00 00 00 00 00 22 02 c1 c3 93 0e d0 9e c2 46 f1 91 2c 94 a3 00 a3 10 04 20 a2 04 5c 00 00 00
│ 01 60 00 02 00 8b 80 01 00 22 03 41 c3 93 47 9c 21 08 04 0d 43 22 39 19 5e 00 e6 00 00 40 6a a9 b8 00 00 00 02 c0 00 00 00 17 00 02 25 04 c1 c5 bf 66 9e 7a
│ … +9 lines
└ rec 0 off 24 size 34 22 02 c1 c3 93 0e d0 9e c2 46 f1 91 2c 94 a3 00 a3 10 04 20 a2 04 5c 00 00 00 01 60 00 02 00 8b 80 01 00
ascii "........F..,...... ..\....`.......
… +2 lines (ctrl + t to view transcript)
rec 2 off 94 size 37 25 04 c1 c5 bf 66 9e 7a 32 e4 09 ea 28 69 69 12 c9 4b 10 06 30 00 02 00 f5 35 c0 00 00 00 16 00 00 00 00 b8 00 10
ascii %....f.z2...(ii..K..0....5............

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• I don’t have enough confidence to hardcode Horizon’s unknown record layout blindly. I’m going to add a permissive mode that skips unknown fields only when
they are byte-aligned padding? Wait unknown appears near start, so not safe. Need maybe request packet dump from actual client now. But maybe can make CLI
output raw count? User offered packet dump. We should ask. But before final maybe commit status. Also remove dump? It's useful. Need run fmt/check, git
status.
```

Perhaps if I had asked it to make some guesses, it would have been able to arrive at the proper conclusion. Or if I had fed it the code to AirSkyBoat. But we had a packet capture already, so this seemed like a good time to provide it to the agent now that it had a more focused task work on:

```markdown
› OK, dumps/search-dump.pcap has a dump I took from Horizon live for you.

• I’ll inspect the pcap structure first, identify the search-server TCP stream, and compare its client/server payloads against our decrypted Horizon response.
Then I’ll update the parser if the record layout is clear from the capture.

• Explored
└ List dumps

• Ran file dumps/search-dump.pcap
└ dumps/search-dump.pcap: pcap capture file, microsecond ts (little-endian) - version 2.4 (Ethernet, capture length 262144)

• Ran which tshark
└ /usr/bin/tshark

• Ran which tcpdump
└ /usr/bin/tcpdump

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

• tshark is available, so I can extract stream payloads directly rather than writing a pcap parser. I’m listing conversations and packet summaries to find the
Horizon search exchange.
```

Remember how I said I didn't feed it originally the packet capture originally to keep it focused and feared that it would try to load it as text? It would appear my knowledge of LLM tooling is out of date. :) It was quite smart and begun munging through it.

I'll spare you all the details but it was able to figure it out:

```markdown
• The key detail is now clear: Horizon’s TCP search list uses the same field tags as LSB, but the result bitstream is packed most-significant-bit
first. The first captured record decodes as name Aadam, zone 246, jobs 15/3, levels 75/37, id 165905, so I can add a fallback parser for that
variant.
```

... along with a few other small problems. In the end, we had a working tool that could connect to at least two different backends in Final Fantasy XI:

```
NAME           ZONE                          JOB         LV      ID
-------------  ----------------------------  -------  -----  ------
REDACTED        FeiYin (204)                  WAR/NIN  75/37   27750
REDACTED        Windurst Woods (241)          THF/BLM  60/30   14226
REDACTED        Eastern Altepa Desert (114)   RDM/BST  24/12  181100
```

## Reflection

It's missing a bunch of features such as supporting the various filters the game does. This is left as an academic exercise for a few reasons:

- Anyone that is capable software developer can do this for cheap either manually or with Codex as I have done here
- Providing fully rich tools out in the open is likely to be harmful

The surprising thing is that Codex was able to get from a pretty crude protocol description to a working tool. It could read the upstream implementation, infer enough of the protocol, write tests around the parsing pieces, and then iterate against a live server once the local pieces looked plausible. I didn't have to feed it the source on a disk. It just went and did those things. I think I would have saved some tokens if it didn't need to `curl` over and over again though. Looking through the session log, it certainly fetched and parsed the entire file more than once. Lesson learned.

The code works, but I would not call it polished yet. It's pretty bad, actually. I don't really know Rust that well but it's filled with magic numbers and lacks any sort of documentation. An agent without the markdown files I provided would likely struggle if they had to black box with this code after the fact. A human would, for sure.

Finally, I deliberately stopped short of implementing more. Some tools [such as psxi](https://www.psxi.gg/) have been allowed to exist but I don't want to publish anything that could be used to ruin a game I love. Search protocols can be used for annoying or abusive behavior if you push too far. I did try and get Codex to implement a single filter and it was unable to do so. I tried to send the packet to search by zone, found no rows and concluded that it was working fine. I told it that it should search "Port Jeuno" which would definitely have folks in it. It gave up. Listing online players was enough to prove the point, and I did not want to build a more complete automation surface just because the agent probably could.

It took longer to write this write up than it did to code the entire thing up! It would probably have taken another 2 hours to read and understand the thing end to end though and I think getting all the features in place would take some time. If I was serious about this, I probably would have gone in-game on to retail to get packet captures of all relevant commands and fed those in.

For the record, Codex with GPT5-5 wasn't able to get that filter fully working even with a packet dump. It did get largely there, though. With the right guidance, I am sure we could get there. It might be missing some edge cases, though. And I would have no idea where those edge cases were. Or if the server format changed. And there in lies the problem with this type of development: I don't understand a lick of the protocol now. If Codex cannot help me, I can not fix this, not in any amount of realistic time anyway.

If I was going to do something like this in production, it seems pretty obvious that large amounts of golden testing at minimum would be needed. I'm relying on fuzzing and observation rather than any sort of deep understanding. And that's fine, for a toy that I don't intend to extend a lot.

> If any Horizons developers are reading this and you want this taken down, just contact me. However, I do think it is harmless given this just mirrors functionality that you can find on the web.
