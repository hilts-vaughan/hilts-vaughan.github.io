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
mdkir ~/horizon-xi
cp "~/Downloads/HorizonXI-Launcher-1.0.0.Setup.exe" ~/horizon-xi/installer.exe
cd ~/horizon-xi
7z x installer.exe
7z x HorizonXI_Launcher-1.0.0-full.nupkg
```

OK, that's done.

Now:

1. Launch ProtonQT-Up
1. Install "GE-Proton7-42"

It should look something like this:

![image-20210619214000116](/assets/horizonxi/proton.png)

Next:

1. Now, open "Steam" and add a 'Non-Steam Game' and navigate to `~/horizon-xi/lib/net45/HorizonXI-Launcher.exe` for the executable
1. Right click the new entry, hit Properties > Compatibility
1. Change to the new version of Proton GE you just installed

Launch the game!

![image-20210619214000116](/assets/horizonxi/compat.png)

The launcher has some bugs. I will document them as I find it later.




