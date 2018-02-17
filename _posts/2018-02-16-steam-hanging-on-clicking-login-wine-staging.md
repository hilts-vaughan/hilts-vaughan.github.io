---
layout: post
comments: true
title: Steam hanging when clicking "Login" on WINE Staging
categories:
- blog
---

# Steam hanging when clicking "Login" on WINE Staging

```shell
touma@setsuna:repos/hilts-vaughan.github.io ‹master›$ wine --version
wine-2.21 (Staging)
```

I was installing Steam in WINE to play a game. I'm not sure if this is a recent problem or not but I was installing WINE and ran Steam, punched in my credentials, hit "Login" and then expected the Steam Guard.

Instead my window hung. I could not click anything else, Steam was locked up. I ended up  having to `xkill` it. What to do?  The WINE output had something like:

```shell
 x11drv: Can't allocate handle for display fd
```

... ok. Out of file descriptors? Let's see how many we have open...

```shell
os -aux | grep wineserver
touma     8792 62.2  0.1  27760 16884 ?        Rs   Feb15 814:28 /usr/bin/wineserver
touma@setsuna:repos/hilts-vaughan.github.io ‹master*›$ lsof -p 8792 | wc -l
4060
```

Well, that's approaching my `ulimit` of `4096`, so I wonder what's going on? Does it stop when it realizes it will not be able to allocate more? Let's see what's opened:

```shell
wineserve 8792 touma 4050r      REG                8,5    97664  7349547 /usr/share/fonts/TTF/YanoneKaffeesatz-ExtraLight.ttf
wineserve 8792 touma 4051r      REG                8,5   112472  7347499 /usr/share/fonts/TTF/YanoneKaffeesatz-Light.ttf
wineserve 8792 touma 4052r      REG                8,5   114376  7353990 /usr/share/fonts/TTF/YanoneKaffeesatz-Regular.ttf
```

Looks like WINE / Steam / someone is scanning all my fonts, or something. `YanoneKaffeesatz` is part of the Google Fonts bundle, which I tried a while ago but never really use anymore. So, let's get rid of them and see if it helps:

```shell
touma@setsuna:~ $ yaourt -R ttf-google-fonts-git	
```

Run Steam, login, and it works.

A bug with Steam? I'm not sure. I hope this helps someone. At least Linux gives us the tools to debug our problems.