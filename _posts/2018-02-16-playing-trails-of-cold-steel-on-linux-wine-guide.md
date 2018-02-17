---
layout: post
comments: true
title: Playing Trails of Cold Steel I && II on Linux using WINE
categories:
- blog
---

# Guide and Remarks: Playing Trails of Cold Steel I && II on Linux using WINE

*If anything here becomes out of date, please email me.*

I'm a huge *The Legend of Heroes* fan and love playing all the games from the series. *XSEED Games* has done a great job releasing the ports for the PC where available and where they can but they only port to Windows. The games are more on the niche side, so it is understandable, but I love them so and still want to play them on Linux as well. I got it working after tinkering for a few hours so I wanted to save any other random Internet go-ers the trouble and write this up so other people can enjoy this as well and other Linux users can give *XSEED* their money so they continue to bring us this great series. ;)

I purchased on Steam version but since they are reported to all be DRM free this should work for any version. You can just skip the Steam instructions if you bought on GOG or something.

## Step 1: Preparing a WINE prefix, getting WINE, etc

**Install WINE**

You need a copy of WINE Staging to get started. Depending on your distribution, you might have to find it elsewhere. I'm on Arch Linux, so you can `yaourt` to get it there if you're like me, `yaourt -S wine-staging` (or Pacman since apparently it's not a AUR package). 

If your distro makes it hard to get a copy of WINE Staging (I tested on 2.21) then you can install [PlayOnLinux](https://www.playonlinux.com/en/) or [Lutris](https://lutris.net/)  which provide local copies of different versions of WINE outside of the system version. Once it's installed, run:

```bash
touma@setsuna:Falcom/ed8_2 $ wine --version
wine-2.21 (Staging)
```

... and this should show you that it's running fine. We can move on.

**Configure WINE Prefix**

I had used WINE in the past for some one-off's but had nothing of value. You can use WINE prefixes but to make this bulletproof I decided to just make a new `.wine` and save myself the trouble. i.e:

```bash
mv ~/.wine ~/.wine.backup
winecfg
```

and this should generate a new `~.wine` for you. You should go check. If you do this with an already existing WINE prefix, you run the risk of having problems. You can either look up how to use WINEPREFIX or you can just move the backup back into place when you are done. This probably only works for the System Wine, if you installed through a third party tool such as Lutris you will need to configure out how to run the configurator for that version. When the dialog comes up, make sure you go to the Staging tab and check off "CSMT" mode as well since this will be needed later. Photo below:

![wine config](/assets/e712d104-1465-46ba-8b60-dbefe9d8c8a4/wine.png)

If you do not have this option, either:

* You're not running Wine Staging, make sure your version is as such (for example, make sure you are running the right wine configuration for the proper version)
* They have merged the CSMT patches. At the time of writing this, this is not true.

We will also be using [winetricks](https://github.com/Winetricks/winetricks) -- your distro should have it somewhere or you can follow the manual instructions [here](https://wiki.winehq.org/Winetricks#Getting_winetricks). It should be fairly simple to get. 

With this, we can move on to installing Steam. If you have something else, you can probably skip this step.

## Step 2: Installing Steam 

I referenced this [test run](https://appdb.winehq.org/objectManager.php?sClass=version&iId=19444) at time of writing and it seems to work. For brevity and to prevent link rot, I will repeat roughly the steps you need to perform below:

```shell
winecfg # Setup a prefix (we already did this, so you can ignore)
winetricks corefonts
winetricks steam
winetricks d3dx9_42
winetricks vcrun2008
winetricks xact
winetricks vcrun2015
```

.. one of these failed but it didn't matter. Or it was one of the commands below. I think it was a package that did not exist or was typo'd. For me, it made no difference. So, don't worry about it. 

I also know from other Falcom titles that these are good to have in hand and won't hurt Cold Steel, I don't know if they are strictly needed but better safe than sorry **in this case** since all we care about is Cold Steel. If this was a shared prefix, we would have to be more careful.

````bash
winetricks amstream
winetricks dsound
winetricks gdiplus
winetricks quartz
winetricks xvid
````

That should be everything. You can go ahead and then start Steam if you have not already (you need to use `wine Steam.exe -no-cef-sandbox` to do this, inside the steam folder), login and start installing Cold Steel. If you have problems with Steam hanging on login (you hopefully will not), you can check out this other post I **[wrote on the topic**]({{ site.baseurl }}{% post_url 2018-02-16-steam-hanging-on-clicking-login-wine-staging %}) which is not documented very well on the web. 

## Step 3: Configuring Cold Steel, and then running it

If everything goes well, Steam should be running and you should be able to hit *Play* to begin the game. You can configure it first. I have the following configuration:

![wine config](/assets/e712d104-1465-46ba-8b60-dbefe9d8c8a4/wine.png)

Just a few notes on my configuration, which I hit "Maximum" and then tweaked from there:

* **MSAA**: Yeah, this is prretty much the only thing I could not get working. It crashed on startup if I had this set at all. The game looks very good without it, so whatever. 
* **Mouse and Keyboard**: I tested the gamepad and it worked fine but I prefer the mouse and keyboard.
* **Fullscreen**: I tried window mode as well, it worked fine. 
* Everything else seemed to work fine, including turbo. 

YMMV. At this point in time, you may want to check all the "Skip video" checkboxes as well, since it will crash initially if you let them play. There's more on that in another section to get that working, detailed below.

If you want, you should be able to launch the actual game with my configuration and start playing.

## Step 4: Getting movies working

If you can either just watch the video files as you need to from the game folder (there's seriously almost no videos in the game, mostly cutscenes) or you can install [LAVFilters](https://github.com/Nevcairiel/LAVFilters/releases) in your WINE to get the videos working. This will vary on system to system, so YMMV.

## Step 5: Loading up your clear save data, importing a CS2 save file, or someone else's from the Internet

If you are playing Cold Steel II, then you would want to import some data. There's some cool stuff if you do. If you're like me and played on the Vita or PS3 first and just want to bring your new save into CS2, then you can download save files from the web. I have one [right here](/assets/e712d104-1465-46ba-8b60-dbefe9d8c8a4/saves.7z) that is a Level 99 Rean NG+ with Alisa selected as the dance partner.  Other people have posted collections on-line, such [as here](https://www.reddit.com/r/Falcom/comments/7vntbc/a_collection_of_cs1_clear_data_ready_for_ng_or_to/). If you do not care, you can skip this step.

**Importing the saves**

OK, so on the web you will see a lot of people saying you need to place these in `C:\Users\<your_username>\Saved Games\FALCOM\ed8` (or ed8_2 for Cold Steel II) which under WINE would be `/home/touma/.wine/drive_c/users/touma/Saved Games/FALCOM/ed8` -- however, if you are like me, placing your saves here will not work. Instead...

```shell
touma@setsuna:~/.wine $ find . -name "ed8_2"
./drive_c/users/touma/Application Data/Falcom/ed8_2
touma@setsuna:~/.wine $ pwd
/home/touma/.wine
touma@setsuna:~/.wine $ 

```

.. and you will realize that there is a folder sitting inside of *Application Data*. For Cold Steel II import, just create a folder called `ed8` and then inside, place your save files:

```
touma@setsuna:Falcom/ed8 $ ls -la
total 1248
drwxr-xr-x 2 touma touma   4096 Feb 15 22:22 .
drwxr-xr-x 3 touma touma   4096 Feb 15 21:46 ..
-rw-r--r-- 1 touma touma 169016 Feb 15 22:08 save000.bmp
-rw-r--r-- 1 touma touma 460992 Feb 15 22:08 save000.dat
-rw-r--r-- 1 touma touma 169016 Feb 15 22:08 save001.bmp
-rw-r--r-- 1 touma touma 460992 Feb 15 22:08 save001.dat

```

... and you should be able to load them. Start the game. Hit "New Game" and when prompted to load clear data, hit yes. The files will be invisible (a problem on Windows as well) but just click slot 0 or 1 and you should load up no problem.

Similar, if you have Cold Steel II Data, just drop it there:

```
touma@setsuna:Falcom/ed8_2 $ ls -la
total 9536
drwxr-xr-x 2 touma touma   4096 Feb 15 23:56 .
drwxr-xr-x 4 touma touma   4096 Feb 15 22:04 ..
-rw-r--r-- 1 touma touma 493976 Feb 15 23:56 autosave00.dat
-rw-r--r-- 1 touma touma   1536 Feb 15 23:56 autosave00_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:03 autosave01.dat
-rw-r--r-- 1 touma touma   1536 Feb 16 00:03 autosave01_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:10 autosave02.dat
-rw-r--r-- 1 touma touma   1536 Feb 16 00:10 autosave02_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:15 autosave03.dat
-rw-r--r-- 1 touma touma   1536 Feb 16 00:15 autosave03_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:26 autosave04.dat
-rw-r--r-- 1 touma touma   1536 Feb 16 00:26 autosave04_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:31 autosave05.dat
-rw-r--r-- 1 touma touma   1536 Feb 16 00:31 autosave05_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:50 autosave06.dat
-rw-r--r-- 1 touma touma   1536 Feb 16 00:50 autosave06_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 23:50 autosave07.dat
-rw-r--r-- 1 touma touma   1536 Feb 15 23:50 autosave07_t.dat
-rw-r--r-- 1 touma touma 493976 Feb 16 00:50 save000.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 22:50 save001.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 22:50 save002.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 22:50 save003.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 22:50 save004.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 22:50 save005.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 23:03 save006.dat
-rw-r--r-- 1 touma touma 493976 Feb 15 23:03 save007.dat
-rw-r--r-- 1 touma touma    120 Feb 16 00:50 save255.dat
-rw-r--r-- 1 touma touma 368640 Feb 16 00:50 sdslot.dat
-rw-r--r-- 1 touma touma 169014 Feb 16 00:50 thumb000.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 22:50 thumb001.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 22:50 thumb002.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 22:50 thumb003.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 22:50 thumb004.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 22:50 thumb005.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 23:03 thumb006.bmp
-rw-r--r-- 1 touma touma 169014 Feb 15 23:03 thumb007.bmp
-rw-r--r-- 1 touma touma  43256 Feb 16 00:50 thumb255.bmp

```

.. as you can see, I've saved a few times. ;)

Eventually, you should have a game running. Minor spoilers below...

![wine config](/assets/e712d104-1465-46ba-8b60-dbefe9d8c8a4/game.png)

... That should be everything you need to play! There are a couple other things that I noticed as well but they might not affected everyone. I've attached some of that info inside of the misc section below. You can read it if you have problems.

## Step 6: Misc. other things

**DLC**

I noticed I had a bunch of DLC unlocked, I was not sure if this was intentional or a WINE bug.

![wine config](/assets/e712d104-1465-46ba-8b60-dbefe9d8c8a4/dlc.png)

The outfits:

![wine config](/assets/e712d104-1465-46ba-8b60-dbefe9d8c8a4/outfit.png)

is for owners of the Trails Series on Steam and other platforms, which I have. So, that makes sense. The rest, I am unsure. Speaking of outfits...

**Crashes with costumes**

On Windows as well at the time of writing, wearing costumes sometimes can cause the game to crash. For example, early on when you enter a certain hot spring, the game will crash wearing the costumes given from the DLC, which I experienced.

**Camera spinning on startup**

Do you have `xboxdrv` installed? I did. `systemctl stop xboxdrv.service` should do the trick while you're playing. You an always `start` it when you are done.

**Performance notes, audio, wine debug**

If you have problems with performance / audio, make sure you set the [WINE Debug flags](https://askubuntu.com/questions/85221/turn-off-wine-debugging) accordingly to get your performance back. 

****

## Reference System

```shell
touma@setsuna:Falcom/ed8_2 $ neofetch
                   -`                    touma@setsuna 
                  .o+`                   ------------- 
                 `ooo/                   OS: Arch Linux x86_64 
                `+oooo:                  Kernel: 4.15.3-1-ARCH 
               `+oooooo:                 Uptime: 13 days, 16 hours, 23 minutes 
               -+oooooo+:                Packages: 1620 
             `/:-:++oooo+:               Shell: zsh 5.4.2 
            `/++++/+++++++:              Resolution: 1920x1080, 1920x1080 
           `/++++++++++++++:             DE: GNOME 
          `/+++ooooooooooooo/`           WM: GNOME Shell 
         ./ooosssso++osssssso+`          WM Theme: Adwaita 
        .oossssso-````/ossssss+`         Theme: Paper [GTK2/3] 
       -osssssso.      :ssssssso.        Icons: Numix [GTK2/3] 
      :osssssss/        osssso+++.       Terminal: gnome-terminal 
     /ossssssss/        +ssssooo/-       CPU: Intel i5-2500 (4) @ 3.7GHz 
   `/ossssso+/:-        -:/+osssso+-     GPU: NVIDIA GeForce GTX 970 
  `+sso+:-`                 `.-/+oso:    Memory: 6230MiB / 16005MiB 
 `++:.                           `-/+/ 
 .`                                 `/                           


```

I play games on GNOME since it works better for me than `i3wm` which is my development WM. I leave this here just so people can see what I was using at the time.

## Ramblings

I've only played about 4 hours by now but I've not noticed any game crippling issues. Game seems to run great, with the occasional minor hiccup but things are good. I'll edit this article if I come across anything that is a deal breaker and how I managed to work past it.