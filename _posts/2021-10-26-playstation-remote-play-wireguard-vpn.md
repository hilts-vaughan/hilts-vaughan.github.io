---
layout: post
title: Playing Playstation remotely over Wireguard
date: 2021-10-26 17:17 -0400
comments: true
---

> tldr; if you want to play over a VPN, consider something like _Chiaki_

I've been going out more lately -- especially now that COVID in Canada has been subsiding and things are returning to some sense of normalcy over the past few months. I've also been playing some games like _Trails of Cold Steel IV_ that are quite long and have been wishing I could take them on the go. Looking for solutions, there are a few to play over the Internet:

* PCs: You can use the remote play application from Sony, but unfortunately it only works under Windows on desktops
* Mobile phones: You can use the official apps from the store but they lack good gamepad support outside of the Dualshock series of controllers

I run Android and use a stereoscopic controller for mobile. I use Arch Linux for my desktop operating system. This makes both of the above solutions problematic. The above solutions also have some other problems for both clients:

* Sony limits the bandwidth you can get from over the Internet through their relay
* Their relay introduces some latency

We then come up with the following needs list:

* Supports whatever resolution I want
* Should be able to play without relying on Sony's server as much as possible
* Should support whatever game-pad I have
* Should work under Linux without trouble
* Ideally, it would support my already existing Wireguard install

# Running official apps over a VPN

The first obvious thing to do is try the applications that Sony provides over a VPN and to see if we make some tweaks to them to get them working for our needs. Unfortunately, this does not work well at all with Wireguard and other Layer 3+ VPNs. The reason is mostly that they use multicast to try and find devices over local networks. You need _Layer 2_ networks to do this.

I found this out after doing some sniffing around and reading this good [https://github.com/williampiat3/ImprovingPSRemotePlay

[](https://github.com/williampiat3/ImprovingPSRemotePlay). In my case, I didn't want to setup a Layer 2 VPN or change my existing networking topology just to accommodate this. However, it does not easily support Linux nor does it meet some of our requirements.

# Running aftermarket over a VPN

The thing that ended up working for me is using two other applications with more support than the Sony applications that also happen to support Layer 3 VPNs due to the nature of allowing direct IP connection:

* Chiaki
* PSPlay for Android

You can setup direct connections for both of these and I can attest they work perfect under Wireguard. I setup some static addresses via DHCP reservations inside of my router and then I can use those to connect when routed through my VPN and it all works well: controller support + good resolution support.

It is worth noting that Chiaki didn't seem to fully support my gamepad like PSPlay did, so that's why I ran with it for Android. This is at the time of writing -- perhaps in the future it will look a bit better. 

