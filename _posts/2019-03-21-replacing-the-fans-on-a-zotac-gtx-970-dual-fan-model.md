---
layout: post
title: Replacing the fans on a Zotac GTX 970 (Dual Fan Model)
date: 2019-03-21 17:17 -0400
comments: true
---

My Zotac GTX 970 is 3.5 years old or so. Or was at the time of writing this post. About three weeks ago, the fans from it started making a whining noise. Some might call it almost a squeak. Or it sounded like perhaps it needed to be lubed. But life was busy and a little fan noise or "coil whine" never killed a card... immediately... right?

Well, they died about two weeks later. Other issues I had leading into those two weeks (for those coming from Google):

* I had a faint chemical odour being emitted from my PC case. Turns out this was most likely from the fans
* The fans would start and stop at random on the GPU. And then the whining would go away
* You would hear "clicking" noises coming from the GPU
* I would try and play games like *Move or Die* or *Warframe* with friends and the temperatures would get stupid high. I would then eventually lose display after a few minutes of gameplay. This often happened around the 100 degree mark. [Nvidia cites around 105 being the max](https://nvidia.custhelp.com/app/answers/detail/a_id/2752/~/nvidia-gpu-maximum-operating-temperature-and-overheating) -- so it sounds about right. 

So, I had to figure out what was wrong. To make matters worse: it died completely with the 4th symptom during a few days I booked off at home to get some stuff done at home + with the intent at least to play some games!

# Diagnosing the fans vs. the fan controller

I wasn't sure if the fans were dead or not. I mean, they didn't work but it could have been _a dead fan controller_. Luckily, it looks like the GPU Fan Controllers just use standard case fan headers so I tested a case fan from the computer in the video card header. 

![header](/assets/970repair/header.jpg)

You can see the header above. 

I gave the card some power and the fans began to turn on and rotate. Looks like we just had some dead fans. 

After checking the specs of the fans and trying to find a comparable part, [I settled on these](https://www.amazon.ca/gp/product/B071GMPX1M/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1). Amazon estimated it would take two days to get them to me.

# Getting me through the days

I still wanted to play while I was waiting on my new fans, though. Of course, not in a reckless way but if I could get something working...

![fan](/assets/970repair/fan.png)

Believe it or not, this was enough to cool the card to play games. It would drop the idle temperatures from 75 to the mid 50s which is not great but was more than serviceable -- and light to mid gaming worked well, if a bit toasty overall. 

Of course, this was temporary. :D

# Installing the new fans

Sorry, I don't have packaging photos. Forgot to take some. Here's the best one I have:

![fan](/assets/970repair/fan.jpg)

Now, onto the steps of what I did. [I more or less followed this guide](https://www.youtube.com/watch?v=BOb4aqcMy5U).  However, I will outline some issues / things I had to do with mine that the video didn't cover.


## Remove the splitting connector

![adapter](/assets/970repair/adapter.jpg)

Mine came with this adapter holding the two together. You don't need this since this GPU has two pins -- and it's just going to get in the way. You can remove it.

## Clean out the dust

Mine had a ton. You might want to consider removing some of this since you're here. I doubt this is strictly needed but I doubt it would hurt, either. 

## Make sure the fans spin right before assembling; make sure wires won't touch the blades

It sounds obvious but I had this problem when I initially installed them. I hadn't retained the wires under the clip perfectly so I had a small problem where the fan blade was hitting up against the wires sometimes.

![wires](/assets/970repair/wires.jpg)

Make sure the wires are down tight and you rotate the fan without trouble.

## Pay attention to how  the casing came off

I didn't and it took a few minutes to figure out the orientation of putting it back on.

# Done!

Success!

![working](/assets/970repair/working.jpg)

Who knows if it's done 100% right? But it works well. I probably should give some other stuff in the case some TLC as well.

The idle temperatures are honestly a bit on the warmer side. 39 or so. Writing this post without much else going (just driving a 1440p display x2) we're looking at:

![temps](/assets/970repair/temps.png)

I've seen better. But I had seen much worse just last week!

In some games, load causes it to go up to about 80, sometimes  85. That's a bit toastier than I think would be ideal -- but honestly, I plan on replacing the card in the next couple of years anyway so as long as it serves me right till then. ;)

Hope this helps someone!