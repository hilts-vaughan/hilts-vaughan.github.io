---
layout: post
title: Setting up zeroRPC on Windows with Node.js
categories:
- blog
---

zeroRPC is a really cool messaging system for distributed communication between server and client applications. In the past, I have used it to have my Node.js applications offload their workload
to other machines. You can already do this with [Cluster](https://nodejs.org/api/cluster.html) in Node.js land or something like [Node Workers](https://github.com/rvagg/node-worker-farm) -- but the super cool part about RPC libraries such as zeroRPC is that it's just a protocol in the end. One handy feature of this is that the client and servers not need be written in the same language -- only speak the same protocol.

You can read more about zeroRPC and why you might want to use it on their site [here](http://www.zerorpc.io/). On this post, I am going to focus on a much more sinister issue I had to deal with when setting it up on Windows. I typically run a Linux workstation, but recently a few collaborators I was working with were on Windows machines. This machines I had to make the install and build process iron-clad with Windows machines, too. zeroRPC probably was one of the more tricky packages to install. Below is a small series of memo's to myself and any future users who may need to get this working.

---

# Setup Instructions

## Install zeroMQ

zeroMQ is a messaging library and zeroRPC is built on top of it. You're going to need the latest windows installer and use that. You can grab the latest windows installer [here](http://zeromq.org/distro:microsoft-windows). You will probably want "x64 build for Vista, 7, 8, Windows Server 2008 R2 and newer."

## Install a connector of your choice

On the [offical site](http://www.zerorpc.io/), there is a couple options, mostly Python and Node.js. If you plan on using Node.js like I did, then just run:

```
npm install zerorpc --save
```

## Installing Visual Studio 2015 for MessagePack

zeroRPC uses MessagePack and this is not documented very well on the home-page (most NIX* systems would just pull this as a dependency). Windows users will need Visual Studio 2015 with C++ installed in order to be able to build it during the Node.js connector `npm install` *Important*: Visual Studio 2015 does not install C++ by default. You will need to select it manually during the install process.

## Migrating from older Node.js versions

If you are using an older box like I was with some other installs and an older version of `node-gyp`, it is likely you will need to reconfigure your `node-gyp` to point to compiling with the latest MSVS. Some native libraries will require you compile with a newer compiler to work. To do this, execute the following:

```
npm install -g --msvs_version=2015 node-gyp rebuild
```

# Python Bindings

zeroRPC is usually used to talk and communicate with other applications. If you plan on using the Python version and you are running Windows, you will likely find this link at Stackoverflow
a neccessity, as I did: http://stackoverflow.com/questions/13395458/how-to-install-zerorpc-python-on-windows/28386060#28386060

# And that should be it...

That's what it took for me. I hope this helps somebody out!
