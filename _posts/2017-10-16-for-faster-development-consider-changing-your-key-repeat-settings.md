---
layout: post
comments: true
title: Misc Development Tip - Move through blocks of text faster by simply increasing key repeat rate
categories:
- blog
---

# Tired of slow scrolling through code? Try changing your key repeat rate

As part of an ongoing attempt to keep my development speedy and find those little micro optimizations that will make my workflow just a little bit faster, I found something I noticed while browsing some programming streams today. Specifically, some editors have very fast scroll speeds.



When I hold my arrow keys to navigate from code block to code block (when not using the navigational shortcuts) there are times where it seems like the cursor just drags on forever.

If you're using Linux like I am, trying reduce your key repeat delay and then increase the amounts of repeat using `xset`:  

```
xset r rate 150 55
```

It makes a huge difference in terms of being able to scale through a ton of text effectively.
