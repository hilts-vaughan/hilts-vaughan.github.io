---
layout: post
comments: true
title: Fixing "playing games under WINE in Steam, the camera rotates in one direction "
categories:
- blog
---

Just writing this down here in case anyone else stumbles across this. On my Arch Linux system, many games running under WINE were having their camera spinning over and over or it would look like a joystick was held down. For example, in *Trails of Cold Steel II* the camera would spin but in *Recettear: An Item Shop's Tale* the main menu would scroll through all the options over and over. Something is sending joystick input.

Turns out, for me, it was `xboxdrv` -- and you can turn it off while you're playing using your distributions service manager. For Arch Linux (and probably any systemd system, which most are by now at time of writing), just:

```shell
systemctl stop xboxdrc.service
```

... or just uninstall `xboxdrv` if you don't need it. 