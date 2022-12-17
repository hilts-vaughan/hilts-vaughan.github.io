---
layout: post
title: Installing and running HorizonXI on Linux
date: 2022-06-19 17:17 -0400
comments: true
---

The following is for installing [HorizonXI](https://horizonxi.com/), a FFXI private server on Linux. Specifically, I am installing with the following Arch Linux System:

```
touma@setsuna:wine/x86_64-windows $ neofetch
                   -`                    touma@setsuna 
                  .o+`                   ------------- 
                 `ooo/                   OS: Arch Linux x86_64 
                `+oooo:                  Model: B450 AORUS PRO WIFI 
               `+oooooo:                 Kernel: 5.12.9-arch1-1 
               -+oooooo+:                Uptime: 6 days, 19 hours, 29 mins 
             `/:-:++oooo+:               Packages: 1672 (pacman) 
            `/++++/+++++++:              Shell: zsh 5.8 
           `/++++++++++++++:             Resolution: 2560x1440 
          `/+++ooooooooooooo/`           DE: GNOME 40.2 
         ./ooosssso++osssssso+`          WM: Mutter 
        .oossssso-````/ossssss+`         WM Theme: EvoPop-Azure 
       -osssssso.      :ssssssso.        Theme: Materia-light-compact [GTK2/3] 
      :osssssss/        osssso+++.       Icons: Numix [GTK2/3] 
     /ossssssss/        +ssssooo/-       Terminal: gnome-terminal 
   `/ossssso+/:-        -:/+osssso+-     CPU: AMD Ryzen 7 3800X (16) @ 3.900GHz 
  `+sso+:-`                 `.-/+oso:    GPU: NVIDIA GeForce GTX 1080 
 `++:.                           `-/+/   Memory: 5913MiB / 32116MiB 
 .`                                 `/
                                                                 
```

## Install HorizonXI - `wine-staging` (non steam-deck; steam deck below)

### Prepare a version of Wine with the proper patches

**tldr; install `wine-staging` if you want something simple (such as `yay wine-staging`) and you're good to go.

You need a version of WINE that won't crash when accepting the EULA, presumably like most XI installs. There are a couple options here. 

1. **"Easy, recommended"**: Use a variant of WINE that has the patch integrated into it already, such as `wine-staging` ([here](https://github.com/wine-staging/wine-staging/blob/534f6ae34e89615fa424ee3e3002b1b3d419a8ba/patches/patchinstall.sh#L4979)). If you are on Arch Linux, you can do this using `pacman -S wine-staging` (or any other helper you use). You can find `wine-staging` in some other repos as well, such as the Ubuntu ones. You can find more on the [WINE install page](https://wiki.winehq.org/Download). There are other versions that include that patch in their definition -- any of them will do.
2. **"Easy, works in a pinch"**: You can download a patched `imm32.dll` from the web such as [https://github.com/bluffnix/ffxi-wine/tree/master/linux](https://github.com/bluffnix/ffxi-wine/tree/master/linux) and replace your system library with it. You can find some directions on the web to do this -- I would recommend you **don't do this** because every time you update the operating system and the `wine` package it's going to get replaced with a new binary. However, I wanted to write this here since it's shown on the web a lot as a drag and drop solution from a lot of users.
3. **"Hard"**: You can compile a version of WINE that has the proper fix. The patch in question [is this](https://gitlab.com/farmboy0/wine/-/commit/54aea128e91a6b03bff05e79d9a09bea572ce99a). If you are an advanced user, you can do this if you can't replace your system wine. If you do this, make sure you compile WINE with 64 bit support since you will need it. If you need help with this, leave a comment but for most users this shouldn't be needed and should only be done if you can't use the other options.

At the time of writing, this worked with:

````
touma@setsuna:tidus $ wine --version
wine-7.22 (Staging)
````

**Note: A lot of places on the Internet tell you to use a specific prefix architecture for Final Fantasy XI; this does not work for many private servers -- so please follow the directions very closely. If in doubt, follow step by step and start with a fresh prefix.**

*Prepare a new prefix for HorizonXI using the following command:*

```
WINEPREFIX=~/.wine-horizonxi-64 winecfg
```

Check that "Windows 7" is selected as the version.

Moving along, let's run the installer inside of WINE:

```
WINEPREFIX=~/.wine-horizonxi-64 wine "~/Downloads/HorizonXI-Launcher-1.0.0.Setup.exe"
```

![image-20210619214000116](/assets/horizonxi/launcher_installing.png)

From this point, you can click "Install HorizonXI" and things will begin working:

1. An install directory, you can leave that as a default but it defaults to your virtual "Users" drive. I left it there since there is no harm (virtualized drive).
1. You **do not need to login** to install the game from what I can tell.

That's it as far as we know right now.

## Install HorizonXI - Steam Play (Steam Deck / other systems)

The following is for Steam Deck users:

1. Boot your Steam Deck into "Desktop Mode"
1. Install ProtonQT from Discover ([link](https://davidotek.github.io/protonup-qt/))
1. Open up "Firefox" and "Steam"
1. Download the installer from the website. It will end up in `~/Downloads`
1. Open a terminal and do the following:

```
mkdir ~/horizon-xi
cp "/home/deck/Downloads/HorizonXI-Launcher-1.0.0.Setup.exe" ~/horizon-xi/installer.exe
cd ~/horizon-xi
7z x installer.exe
7z x HorizonXI_Launcher-1.0.0-full.nupkg
```

OK, that's done.

Now:

1. Launch ProtonQT-Up
1. Install "GE-Proton7-42"
1. Restart Steam / deck if you can't restart Steam from desktop

It should look something like this:

![image-20210619214000116](/assets/horizonxi/proton.png)

Next:

1. Now, open "Steam" and add a 'Non-Steam Game' and navigate to `~/horizon-xi/lib/net45/HorizonXI-Launcher.exe` for the executable (you may have to change ".desktop" at the bottom to all application types)
1. Right click the new entry, hit Properties > Compatibility
1. Change to the new version of Proton GE you just installed

Launch the game!

![image-20210619214000116](/assets/horizonxi/compat.png)

Begin installing.

The launcher has some bugs. Continue down to FAQ down below to find any problems you might have. You may want to read them all before clicking install.

When install is _complete_ you can run:

```
sudo find /home -name "HorizonXI.zip" -type f | sed 's/ /\\ /g' | xargs -i rm {}
```

... to clean up the ZIP to get some space back.

## FAQ for Linux

### The launcher keeps crashing while trying to install the game

... and it's wiping all my progress!


Mandatory warning from the HorizonXI staff: 

> **Please note:** We will not offer support for users that bypass the launcher with this setup, it's a work around for users having memory issues due to having less than 16gb ram on PC.**

Still with me? OK, next.

There is a memory leak in the launcher as of launch day. The launcher does not save progress. The staff are working on fixing it but in the meantime, you can follow the below steps to get it working:

```magnet:?xt=urn:btih:4eecae8431428820347314bc002492e210f29612&dn=HorizonXI.zip&tr=udp%3a%2f%2fopentracker.i2p.rocks%3a6969%2fannounce&tr=https%3a%2f%2ftracker.nanoha.org%3a443%2fannounce&tr=https%3a%2f%2ftracker.lilithraws.org%3a443%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a6969%2fannounce&tr=https%3a%2f%2fopentracker.i2p.rocks%3a443%2fannounce&tr=udp%3a%2f%2ftracker1.bt.moack.co.kr%3a80%2fannounce&tr=udp%3a%2f%2ftracker.torrent.eu.org%3a451%2fannounce&tr=udp%3a%2f%2ftracker.tiny-vps.com%3a6969%2fannounce&tr=udp%3a%2f%2fpublic.tracker.vraphim.com%3a6969%2fannounce&tr=udp%3a%2f%2fp4p.arenabg.com%3a1337%2fannounce&tr=udp%3a%2f%2fopen.stealth.si%3a80%2fannounce&tr=udp%3a%2f%2fopen.demonii.com%3a1337%2fannounce&tr=udp%3a%2f%2fmovies.zsw.ca%3a6969%2fannounce&tr=udp%3a%2f%2fipv4.tracker.harry.lu%3a80%2fannounce&tr=udp%3a%2f%2fexplodie.org%3a6969%2fannounce&tr=udp%3a%2f%2fexodus.desync.com%3a6969%2fannounce&tr=udp%3a%2f%2f9.rarbg.com%3a2810%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337&tr=udp%3a%2f%2fexplodie.org%3a6969```

1. Launch the installation once
1. Let it begin downloading some of the files
1. Kill the launcher
1. Grab the magnet with your favourite torrent client -- you can use a PC for this and transfer the file to the deck or just install something like Transmission / Deluge / qtBitTorrent on your Deck to use.
1. Wait for the download to finish. It won't crash :) 
1. Open `Dolphin` (file manager) and navigate to `/home/deck/.local/share/Steam/steamapps/compatdata/2237253119/pfx/drive_c/Program Files/HorizonXI/Downloads/`.
1. The above path is an example -- your randomly generated number after `compatdata` is probably different and the install path depends on what you picked.
1. Place the ZIP in this folder
1. Open `Dolphin` (file manager) and navigate to `/home/deck/.local/share/Steam/steamapps/compatdata/2237253119/users/<user>/AppData/Roaming/HorizonXI-Launcher/config.json`
1. Open `config.json` and modify the file:

```
		"baseGame": {
			"downloaded": false,
```

should be replaced with:

```
		"baseGame": {
			"downloaded": true,
            
```

If you open the launcher, it should now finish installing the game.

### Launching gamepad configuration prevents my game from launching anymore

Sorry about that. It looks like a bug. Windows users are reporting the same. 

You have two choices:

1. Re-install and don't click Gamepad configuration -- the bug should be sorted "soon"
1. If you need gamepad support (Deck / using gamepad out of the box), you can follow this guide: https://www.youtube.com/watch?v=0UYdFoaVnOE&lc=UgywlUbnFvFWxBUOzW54AaABAg. It's not supported by the team,
   but has been confirmed to work on the deck. You may need to use spaces instead of commas (thanks Raphy@).

A patch is supposed to come soon for gamepad players.

### I can't see buttons on the UI

The launcher has a fixed size. You can open the Steam keyboard and use tab to move around controls you can't see, dock your Steam Deck to a montior / TV for more space, or use KDE window management features to move it around (google: "kde move window with mouse").

### Where can I get artwork for my install?

You can find some at [assets](/assets/horizonxi/assets.zip).

These are offical art assets cut for the Deck. Thanks to trent@ and Aku@.