---
layout: post
comments: true
title: Installing Final Fantasy XI and dual boxing on the Nasomi Private Server (Linux) 
categories:
- blog
---

I recently wanted to give the Nasomi XI Private Server a try as I had played a lot of Final Fantasy XI when I was younger and was feeling a bit nostalgic. Since the population is a bit smaller than it was then but still very respectable (1300 players during prime time) there are quite a few dual-boxers. These are people who play more than one character at the same time. For those not familiar, Final Fantasy XI is a game that is very heavy on co-operation and a lot of tasks require at least two players and often a lot more. Most people do this dual boxing because..

1. It is allowed here and encouraged where it was not on the retail servers.
2. It makes a lot more content more accessible to you without needing to rely on others for EVERYTHING.

The only problem was my platform of choice these days is a Linux x86 PC where as I had played on a PS2 during the early 2000s era of Final Fantasy XI. Nasomi is not supported on the PS2 -- so that just left getting the game running on Linux or running it in Windows. 

**Spoilers: ** It runs inside of Linux very nicely -- we just need to put in a bit of effort to do so.

# The Guide

Let's get started by just downloading the official installer for Windows from [here](https://na.nasomi.com/download.php). You can pick whatever method you want -- there is no difference in the contents. 

Next,  you're going to want to unzip the package somewhere. You can use a GUI tool or the `unzip` command for this but it does not matter much. if you don't have WINE or have no idea what it is, you can read about it more [here](https://en.wikipedia.org/wiki/Wine_(software)). We're going to make use of it -- there's a trick, though... the official wiki recommends some weird hacks to get it running and we will still need to do this but it applies them to the installed version of `wine` on your machine since the wiki suggests butchering your system install of WINE.

There's a couple snags I ran into and I will list them here:

1. It asks you to override a DLL to play -- and this is going to get overwritten every time you have to an update, or at least it would be on *Arch Linux* which is my OS of choice for playing games. 
2. It does not account for the fact that there is an [open bug](https://bugs.winehq.org/show_bug.cgi?id=45279) in newer versions of WINE that prevent Final Fantasy XI from being playable. There are a few things that can be wrong -- but if you have a Nvidia card like me you are likely to run into this at the time of writing if you are running a rolling release. This might not be everyone but there are enough of us that someone is going to have a bad time. 

![this is what happens when you are using the latest version without the patch](/assets/bf9bf6a4-6426-4653-a7b1-5988b1104afb/artifact.png)

3. It does mention *Ashita* won't work but it does not mention how to get dual boxing support.  I've had not found a way to get Ashita v2 working yet reliably but there are ways of getting dual-boxing working.

Thus, there are two things we can do to get around this and have a much better experience. 

1. We will grab a local copy of WINE and use this for our FFXI -- and do the DLLs overrides in a local copy
2. We will then be able to apply the patch as well on top for this, allowing us to apply any sort of bug fixes we need to get the same running (see: #2)

Let's get started. I'll assume you have copied the installer into a folder, such as `~/nasomi` and we are working inside of there.

1. Grab the WINE source code (or `wine-staging`) if you prefer that and clone it with

   ```bash
   git clone https://github.com/wine-mirror/wine
   ```

2. Go into the source directory (`cd wine`) and then download the patch from before that we need, apply it and commit it. **If you are using Wine 3.19 or a later trunk, you may need to use this path instead https://bugs.winehq.org/attachment.cgi?id=62646&action=diff&context=patch&collapsed=&headers=1&format=raw as the below patch may not apply clean

   ```bash
   wget "https://bugs.winehq.org/attachment.cgi?id=62460&action=diff&context=patch&collapsed=&headers=1&format=raw" -O ffxi.patch
   git apply ffxi.patch
   git commit -am "Applied FFXI patch for NVIDIA cards"
   ```

3. We're going to compile WINE. Inside the `wine` directory (you can check you are in the right directory by running `git status` and making sure it reports as found) run...

   ```bash
   ./configure
   make -j 2 # You can make this the number of processors you have
   ```

   As it's compiling, move onto the next step.

4. Now, grab the DLL override. The wiki has a copy of it [here](http://nabutso.com:4438/FFXI/imm32.dll.so) however, I will provide a copy of the same DLL [here](/assets/bf9bf6a4-6426-4653-a7b1-5988b1104afb/imm32.dll.so) as well on  my own server in case it ever goes offline, since the  link is to another player's server. For example, you can just do this to get the file (or use the URL from my server if that is ever needed):

   ```bash
   wget http://nabutso.com:4438/FFXI/imm32.dll.so 
   ```

5. We need to replace the DLL now inside of the WINE folder. We can do this with a simple copy command:

   ```
   cp imm32.dll.so dlls/imm32/imm32.dll.so
   ```

   from inside the WINE directory. This should give you the ability to run without problems now.

6. We are ready to begin installing the game. There's a setup EXE or batch file (depends on the version of the game) and you can run it by doing the following:

   ```bash
   WINEPREFIX=~/ffxi-custom-first WINEARCH=win32 ./wine/wine "./installer.exe"
   ```

   A couple things to note above:

   * You should replace the `WINEPREFIX` without whatever you want -- in my case, I have two separate prefixes for both players so I can have completely different settings and I have the diskspace to support it. And you should change the installer EXE to whatever the name of the setup installer is of the version at the time of running.
   * FFXI is a 32 bit game so we are going to be running in 32 bit mode.

7. You should get the installer with some music. Just install with the defaults and move on. This took about 5 minutes for me on an SSD -- time will vary.

8. The game is installed -- so it's time to run it. By default, the settings are a bit weird so it might be worth just configuring them quickly. You can do by running the following command:

```bash
WINEPREFIX=~/ffxi-custom WINEARCH=win32 ./wine/wine "/home/touma/ffxi-custom/drive_c/Program Files/NasomiXI/SquareEnix/FINAL FANTASY XI/ToolsUS/FINAL FANTASY XI Config.exe" 
```

... and you can change some things like the resolution, bump settings, texture resolution etc. When are you done, save your changes and we can move onto playing the game.

9. You can run the following command to play:

```bash
WINEPREFIX=~/ffxi-custom WINEARCH=win32 ./wine/wine "/home/touma/ffxi-custom/drive_c/Program Files/NasomiXI/SquareEnix/Ashita/ffxi-bootmod/boot.exe"
```

and then you are good to go. The game should launch. If you want to dual box, you would do the same thing as you just did but with another copy of WINE -- checked out from the source code again. This will give you two `WINESERVER`s and prevent the crashing on startup you would get from trying to launch two clients at once under normal circumstances. 

**None of this will have Ashita running, though since that does not work in v2 with Nasomi**

![this is what happens when you are using the latest version without the patch](/assets/bf9bf6a4-6426-4653-a7b1-5988b1104afb/ffxi_nasomi.png)

# Other things you may want to know 

* FFXI benefits from the `esync` patches -- so if your CPU is a bit on the weaker side like mine you may want to get a WINE Build with them included. 
* **Create launch scripts.** It sounds obvious but don't forget you can create simple bash scripts to wrap some of the commands for launching the game. I have a script for each of my characters so I can run whatever one I want to login to.
* **Periodically update WINE.**  There are performance benefits you can get from updating your copy (`git pull`) from the mirror from time to time. You may want to do this from time to time. 
* The patch from above may stop working at some point -- you may need to reapply it from time to time with a new one. Or it might not be needed at all. You can pick a stable WINE tag if you want to avoid problems. For example,  if you are using 3.19 as a base you will notice there is a [different patch here](https://bugs.winehq.org/show_bug.cgi?id=45279) for that.
* This has only been tested on the below configuration, I have not tested on anything  else:

```bash
touma@setsuna:~ $ neofetch
                   -`                    touma@setsuna 
                  .o+`                   ------------- 
                 `ooo/                   OS: Arch Linux x86_64 
                `+oooo:                  Kernel: 4.18.16-arch1-1-ARCH 
               `+oooooo:                 Uptime: 10 days, 6 hours, 34 minutes 
               -+oooooo+:                Packages: 1393 (pacman), 4 (dpkg) 
             `/:-:++oooo+:               Shell: zsh 5.6.2 
            `/++++/+++++++:              Resolution: 2560x1440 
           `/++++++++++++++:             DE: GNOME 3.30.1 
          `/+++ooooooooooooo/`           WM: i3 
         ./ooosssso++osssssso+`          Theme: Paper [GTK2/3] 
        .oossssso-````/ossssss+`         Icons: Numix [GTK2/3] 
       -osssssso.      :ssssssso.        Terminal: terminator 
      :osssssss/        osssso+++.       CPU: Intel i5-2500 (4) @ 3.700GHz 
     /ossssssss/        +ssssooo/-       GPU: NVIDIA GeForce GTX 970 
   `/ossssso+/:-        -:/+osssso+-     Memory: 7723MiB / 16002MiB 
  `+sso+:-`                 `.-/+oso:
 `++:.                           `-/+/                           
 .`                                 `/

```

The rest you can figure out from the Nasomi page and is standard stuff. This ought to work for any server or set of people who cannot run Ashita or Windower as well, such as macOS users but your steps may vary.

