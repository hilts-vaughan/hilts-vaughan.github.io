---
layout: post
title: "Using Codex on this blog"
date: 2026-07-09 22:42 -0400
comments: true
bluesky_author_handle: "hilts-vaughan.bsky.social"
bluesky_auto_discover: true
---

> Disclaimer: I work at Google and have used Antigravity and the suite of models quite extensively. However, I am quite new to the actual open source tech stack
> outside of the so called "tech island". This is a series of posts as I explore the open source landscape and trying projects out that are outside of the typical corporate stack.

The blog has not had some activity in a long time. Since I was looking to explore and check out some of the open source stacks, I figure this was as good of a place as any to start. The first order of business: let's see if we can get the site looking a little more modern. I've long since been using [sakura.css](https://github.com/oxalorg/sakura) in pretty much all of the small web applications that I build these days, so it seemed like a good fit here. The out of the box styles all look good and require almost no effort. It also works on mobile, which my current site does not.

I had a goal.

## Getting started

I needed a set of tools to work with. I already knew that I wanted something that would work within VS Code because I was already so used to it and a lot of the internal tooling at work is already based off this. Sure, I could learn _even more things_ but I didn't really want to get lost in the weeds. I did some research and asked around the Applied AI organization that I'm part of at Google. That was not the point of this exercise. Looked at few options:

- QWEN on a 9070 XT that I had
- ChatGPT w/ Codex
- Claude Code
- z.ai and using Claude or Cline as a harness

This is already covered on the web well, so I'll only outline a couple of my core thoughts:

- Claude Code was all the rage many months back but many folks at work had commented that Codex was much better as of recent
- z.ai was in the consideration list for the cost and value but I just read too many horror stories about it being slow, especially for off peak work
- Local models were tried and just not a good experience when I tried them a few months back
  - The token rate was slow and I was unable to any complicated work done.
  - However, as to be covered below many of the tools I ended up picking can support some sort of hybrid mode.
- The new GPT model would become available soon and unlike Mythos, should be widely available

I ended up settling for a ChatGPT Plus since it was cheap at only 25 CAD. Codex had been considered really good. Seemed like as a reasonable first attempt. It was super easy to purchase and get started. Signing in with SSO and making a purchase took perhaps 10 minutes.

Installing the CLI was a little longer since Codex for my distro can only be gotten from `openai-codex-bin` from the AUR. I had to spend a bit of time ensuring this package is indeed safe.
The only other snag I had run into was trying to figure out the differences between Go and Plus for OpenAI.

However, perhaps 20 minutes later I had all the packages installed. Not bad at all! I installed Codex and Cline and perhaps within another hour or so I had a fully working basic setup. I am aware that things like `pi` and other harnesses exist but simple is good. Antigravity was perhaps a bit less work to setup since I just had to answer some prompts but this wasn't bad at all.

## Porting a new theme

I fired up Codex and got to work. I prompted:

> I would like to upgrade my blog platform. I think it's currently using a very old version of jekyll. The theme is quite old and I would like to refresh it.
> I am thinking of using sakura.css and to write something: https://github.com/oxalorg/sakura
> Could you look at the features of the current theme and try to port this over?

Honestly, it produced a decent end product! It had a number of glaring problems, though. It had moved all the sidebar content into a header. The header was super chunky. It had duplicated things such as bio links in the header
as well under "About". I also had to make some changes that were a matter of "taste" such as using icongraphy for the social stuff. I had to change the logo a bit (yes, it is nano banana) since it did not fit the color scheme. Codex did not for whatever reason add proper theme support out of the box.

Some other minor problems too:

- Random elements had a hover border that was causing layout shift
- Random hover/focus underline left behind after mouse clicks
- Some very minor alignment problems
- The markup was just... okay. It was very clearly a mechanical port and not much else. That being said, it was good enough. We used HTML5 tags.

I'm quite experienced in front end development have done it in $DAY_JOB for well over a decade at this point, so taming some markup and making it look a bit nicer was simple, though. Task done in perhaps 20 minutes and I was playing Satisfactory while it churned for most of that. I think I could have done it myself in maybe an hour. Perhaps two. The change itself is not that bad and the code was simple to follow. You can find the [commit here](https://github.com/hilts-vaughan/hilts-vaughan.github.io/commit/8df5f651ac097f51a7c249ca7ef7193d6b64b0f4#diff-88e83e5d0edb4286d0e35534fa9f49405a4ef6724137b468772a31183cb43a3f). Sorry, it's a bit of a mess since I just amended with some other changes. However, the actual markup changes are straightfoward. Still, Codex had to be able to work out some stuff to get that job done. Impressive or not, it was a task I had put off for some time that was done just like that. I hear there are "taste" skills that I could install and perhaps I will look into those in the future. For now, human taste is enough for me.

**Cool.**

## Updating Jekyll

The blog is powered by Jekyll. It's probably not cool in 2026 anymore. However, it also has been working unflinchinly for about 10 years on Github Pages. Boring is good. That being said, I've been getting nagged about old dependencies that I should update and the like for ages. I don't run the infrastructure, so these vulnerabilities won't _directly_ hurt me but:

- Someone could in theory perhaps exploit a markdown parser bug to inject something into my blog, if they could figure it out
- Harm Github in some way or cause them not want to build my bundles anymore
- It is _generally_ a good idea to be more than a decade up to date

The first two are not very liklely and Github sandboxes the deployment almost certainly. The last reason is the most obvious reason I did this. ;)

Prompt:

> OK, we have a blog instance and the modules are quite old. Could you try and upgradde it ?

We ended up with a working install. I pushed it after it reloaded. Unfortunately, I didn't realize I had a `serve` running still and Codex told me that everything was fine.. and I tested it and it looked good.
When I pushed, the site went live. I tried to serve it locally and... crash! It turns out I had some global `gem` stuff installed and needed to clean up some local filesystem stuff. I didn't really want Codex adminstering
my packages, so I cleaned that stuff up for `bundle` and moved on.

I am sure Codex could have probably figured it out but I am not that confident yet. ;)

## Some other misc thoughts

Jogging some raw thoughts down:

- Pretty good. It was simple enough to get going and I knew about what I wanted to get a good result. Even if I didn't, I think this task is simple enough that it was doable.
- Those two tasks burned 20% of my 5 hour quota. Not so good!
  - I had a friend let me know that token caching is not so good on the current GPT and Terra may perhaps fix this.
- Things were quite quick since I'm using static stuff only. This is in contrast to work where the feedback loop can be quite long for more complex systems at times.
- It was pretty good to see fully what is going on in the CLI and reviewing the work closely would probably take a bit longer.
  - Need to try more ambitious things to see how far we can take things

Until next time.
