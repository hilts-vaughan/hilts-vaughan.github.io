---
layout: post
title: Installing and running WingsXI on Linux
date: 2021-06-19 17:17 -0400
comments: true
---

The following is for installing [WingsXI](https://wingsxi.com/), a WoTG FFXI private server on Linux. Specifically I am installing with the following Arch Linux System:

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

There a few guides on the Internet that explain how to get this working as things are today but none of them cover WingsXI specifically which has a few quirks, so this guide will run through it. You can skip to each section if you want to know about specific parts of WingsXI or just installing Final Fantasy XI on Linux in general. All the commands here are given for Arch based distributions but you can find commands (such as replacing `yay` with something else such as `apt-get` for your system if you are using something else)

## Downloading WingsXI

* You can visit the WingsXI Discord from their site to get the latest binary. At the time of writing, this [is this file](https://cdn.discordapp.com/attachments/787567400429944843/848723709086662666/Install_Wings_v3.torrent) -- however you should check Discord and check out the #first-time-setup to ensure you're getting the latest version. It's a torrent -- so ensure you have some sort of torrent software to grab it. I use Deluge. 
* [Sign up for an account](https://wingsxi.com/wings/index.php?page=signup).
* **Activate your account via the e-mail that you provided**.

## Prepare a version of Wine with the proper patches

You need a version of WINE that won't crash when accepting the EULA. There are a couple options here. 

1. **"Easy, recommended"**: Use a variant of WINE that has the patch integrated into it already, such as `wine-staging` ([here](https://github.com/wine-staging/wine-staging/blob/534f6ae34e89615fa424ee3e3002b1b3d419a8ba/patches/patchinstall.sh#L4979)). If you are on Arch Linux, you can do this using `pacman -S wine-staging` (or any other helper you use). You can find `wine-staging` in some other repos as well, such as the Ubuntu ones. You can find more on the [WINE install page](https://wiki.winehq.org/Download). There are other versions that include that patch in their definition -- any of them will do.
2. **"Easy, works in a pinch"**: You can download a patched `imm32.dll` from the web such as [https://github.com/bluffnix/ffxi-wine/tree/master/linux](https://github.com/bluffnix/ffxi-wine/tree/master/linux) and replace your system library with it. You can find some directions on the web to do this -- I would recommend you **don't do this** because every time you update the operating system and the `wine` package it's going to get replaced with a new binary. However, I wanted to write this here since it's shown on the web a lot as a drag and drop solution from a lot of users.
3. **"Hard"**: You can compile a version of WINE that has the proper fix. The patch in question [is this](https://gitlab.com/farmboy0/wine/-/commit/54aea128e91a6b03bff05e79d9a09bea572ce99a). If you are an advanced user, you can do this if you can't replace your system wine. If you do this, make sure you compile WINE with 64 bit support since you will need it. If you need help with this, leave a comment but for most users this shouldn't be needed and should only be done if you can't use the other options.

At the time of writing, this worked with:

````
touma@setsuna:tidus $ wine --version
wine-6.10 (Staging)
````

**You must wait until the download of Wine and WingsXI to continue on from this point.** 

## Preparing a prefix for WingsXI

**Note: A lot of places on the Internet tell you to use a 32-bit prefix for Final Fantasy XI; this does not work for WingsXI so please follow the directions very closely. If in doubt, follow step by step and start with a fresh prefix.**

*Prepare a new prefix for WingsXI using the following command:*

```
WINEPREFIX=~/.wine-wingsxi-64 winecfg
```

If you get prompted for installing Gecko, you can accept without trouble.

This will generate a new prefix. You should check:

1. That the configuration window shows up
2. Windows 7 is selected as the version

Moving along, let's run the installer inside of WINE:

```
WINEPREFIX=~/.wine-wingsxi-64 wine ~/Downloads/Install\ Wings\ v3/Installer.exe
```

![image-20210619214000116](/assets/wingsxi/image-20210619214000116.png)

From this point, you can click through the prompts and you should get:

1. An install directory, you can leave that as a default and the rest of the guide will assume you did. It will be a Windows path that is relative to your prefix.
2. A bunch of prompts that will install various Visual Studio redistributable packages. Let that run. 

It should complete without trouble. Next, unfortunately WingsXI bundled with an installer that does not setup the path to the boot command by default. We can fix this with a quick `sed` replacement, so go ahead and run this:

```
sed -i 's/C:\\Users\\alexs\\Desktop\\Installer Package\\Ashita\\ffxi-bootmod\\pol.exe/C:\\WingsXI\\Ashita\\ffxi-bootmod\\wingsloader.exe/g' "~/.wine-wingsxi-64/drive_c/WingsXI/Ashita/config/boot/New Configuration 1.xml"
```

(If the above does not work, you can edit the file manually as well)

## Running WingsXI

To run the game, you can use the following command:

```
WINEPREFIX=~/.wine-wingsxi-64 wine ~/.wine-wingsxi-64/drive_c/WingsXI/Ashita/injector.exe "New Configuration 1.xml"
```

You should get a login screen that looks something like:

```
touma@setsuna:WingsXI/Ashita $ 19/21 21:48:47] DarkStar Boot Loader (c) 2015 DarkStar Team
[06/19/21 21:48:47] Git Repo   : https://github.com/DarkstarProject/darkstar
[06/19/21 21:48:47] Modified for use with the Wings Project (c) 2021 Wings
[06/19/21 21:48:47] Version: 1.02
[06/19/21 21:48:47] Website    : https://www.wingsxi.com
[06/19/21 21:48:47] Git Repo   : https://gitlab.com/ffxiwings/wings
[06/19/21 21:48:47] ==========================================================
[06/19/21 21:48:47] Checking for updates...
[06/19/21 21:48:48] Already using the latest version.
[06/19/21 21:48:48] Connected to server!
```

From the login:

1. Press "1" for login
2. Type your username from the registration site
3. Type your password from the registration site

You should login. If you are having trouble, consult the following common issue list:

1. **The game crashes before I can see anything.** You are probably running a 32 bit prefix or something else that is not configured wrong. Open a bug on WINE or attach a crash report here so I can help you.
2. **The game crashes after I accept the EULA.** You don't have the X11DRV patch or it has stopped working. Try the WINE version listed here, make sure you're using staging, or ensure you're running your patched compiled version. 
3. **The login boot loader keeps repeating the menu over and over and I can't login.** There exists a bug in WINE at the time of writing that prevents you from using the bootloader IO console. You can work around this by editing the boot command from WingsXI with your own command. If you have modified **nothing else** in the XML configuration, you can run this command with replacing **username** and **password** with your own values to resolve this quickly: `sed -i 's/-server game.wingsxi.com/-server game.wingsxi.com --user USERNAME --pass PASSWORD/g'  "~/.wine-wingsxi-64/drive_c/WingsXI/Ashita/config/boot/New Configuration 1.xml"` 
4. **When I tab out of the game, I can't move / my macro palette keeps coming up.** This is due to your ALT key being stuck as being read. You can address this in a couple ways but the simplest way to do this is run `winecfg` per the initial command at the start of the guide again (`WINEPREFIX=~/.wine-wingsxi-64 winecfg` and turn on "Virtual Desktop" to get it's own window frame). Alternatively, when tabbing back in simply press "Alt" again and it should work again.

Assuming a successful login, you should be able to login with a character and get going without any trouble now. You should have access to all Ashita plugins like you should under Windows as well.

You can create a shell script to run this command if you want / make a desktop shortcut out of it. 

## Correcting gamma

There exists an issue in XI that for some users when you launch the game it will request a gamma shift to play the opening movie but this gamma shift becomes permanent while the game is running. To fix this:

1. If you are running GNOME or some other DE, you can simply reload the shell after launching to revert the change. For example, for GNOME you can do Alt+F2 and then type "R" and Enter. KDE, etc have similar commands you can look up.
2. You can change some registry settings to [shut this off](https://www.reddit.com/r/wine_gaming/comments/73a5cw/disallow_gamma_changes_from_wine_games/). Since changing the registry can be dicey, I won't provide a one liner for this but you can find information online once you understand you have to change.

You'll know the gamma has changed when you see it.

## Configuring XI / Running the Ashita GUI

The Ashita GUI itself will not run (or I could get it to run) under a 64 (auto) prefix. It does, however, work, in a 32 bit prefix with one caveat: the game won't launch from the launcher due to some other stubbed behaviour of fetching values from the registry. 

I would recommend you open the configuration file at `~/.wine-wingsxi-64/drive_c/WingsXI/Ashita/config/boot/New Configuration 1.xml` and simply modify it yourself. The syntax is very straightforward and you can edit things like `default.txt` with a simple text editor to get most of the control that that the GUI provides.

However, it IS possible to run Ashita in a 32 bit prefix if you want to, configure things there, and then copy the config to your 32 bit prefix. To do this:

1. Install `wine-staging` if you didn't already
2. Create a 32-bit prefix such as `WINEPREFIX=~/.wine-wingsxi-32 WINEARCH=win32 winecfg`
3. Install WingsXI per the directions above
4. Install .NET 4.0 and 4.5.2 into the prefix: `winetricks dotnet40 dotnet45 WINEPREFIX=~/.wine-wingsxi-32 WINEARCH=win32` (you may need to install winetricks if it was not included in your wine package such as `pacman -S winetricks`)
5. You can now run Ashita `WINEPREFIX=~/.wine-wingsxi-32 wine ~/.wine-wingsxi-32/drive_c/WingsXI/Ashita/Ashita.exe`
6. Make your config changes and then save them out to the other prefix

You may be able to run Ashita from the old install from a the 32-bit `wineserver` but I've not tried it. Editing config files is something you only have to do once, so I did mine by hand. I would seriously recommend just doing that. 

## Addressing performance

**The following section is true of Windows as well but it not documented well on the web so I will document it here.**

Performance in FFXI is fine in 30FPS mode and even in 60FPS for most setups. However, in cities with a lot of people in them performance can suffer at times due to the single threaded nature of the game and using DX8 which WINE support for it crummy.

You can do a few things to make this a lot better:

1. Turn off shadow using `/localsettings shadows off` in game.
2. Run the game in 30FPS mode using `/fps 2` if you can't maintain 60FPS
3. Installing a wrapper to convert D3D8 calls into D3D9 or Vulkan calls.

There are many things that can do this:

1. dgVoodo
2. Ashita's proxy
3. [crosire](https://github.com/crosire/d3d8to9/releases)

I use *crosire's* proxy. You can install it by:

1. Downloading the latest DLL from the release page

2. Copying `d3d8.dll` it into the various spots:

   1. `~/.wine-wingsxi-64/drive_c/WingsXI/Ashita/ffxi-bootmod`
   2. `~/.wine-wingsxi-64/drive_c/WingsXI/SquareEnix/FINAL FANTASY XI`
   3. `~/.wine-wingsxi-64/drive_c/WingsXI/SquareEnix/PlayOnlineViewer`

3. Set `winecfg` to use the native override

   1. Run `WINEPREFIX=~/.wine-wingsxi-64 winecfg`

   2. Set the override in the library tab

      ![image-20210619221721174](/assets/wingsxi/image-20210619221721174.png)

4. Run the game per normal

The process is very similar for all the other proxies. If one does not work well for you, you can try others. Some users have had luck with layering proxies to translate into Vulkan (for lower CPU draw call overhead, such as `dxvk`) ultimately but I get a smooth frame rate with a single one, so I've not had the need. If you have steps for this, leave a comment and I can include them.

### "Make FFXI beautiful 2021"

The following are a couple notes you may find useful. I will update them as time goes on into full out guides if there is interest:

1. https://www.reddit.com/r/linux_gaming/comments/b2hi3g/reshade_working_in_wine_43/
2. https://www.youtube.com/watch?v=ADjRYUdSyXA
3. https://nocturnalsouls.net/getting-setup/high-definition-dats/

* The path of least resistance for WingsXI for HD mod replacements is DAT replacement directly. You can snapshot your prefix folder to get easy rollback -- or use a `brtfs` snapshot if you want, that makes this trivial to roll back for updates (something WIndows users can't do)

## Did I miss something?

If you can't get it working, you can find me on the Wings Discord or you can leave a comment below. I've tried to cover everything you would have to do and will flesh out things like HD Mods as I have time to type it out but in the meantime, contributions are welcome.

**#windurst**
