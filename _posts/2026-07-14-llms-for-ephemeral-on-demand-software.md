---
layout: post
title: "Usng LLMs for ephemeral on demand software"
date: 2026-07-14 00:00 -0200
comments: true
bluesky_author_handle: "hilts-vaughan.bsky.social"
bluesky_auto_discover: true
---

I've been recently toying with the idea of writing a book since 2023 to collect some of the thoughts I've had on sofware development and specifically around debugging throughout my career. I've picked it up and stopped a few times. The act of writing itself isn't bad, I enjoy it quite a lot. But writing a book is more than just writing. I wanted to include diagrams, runnable code samples, PDFs, ePubs and more. It's true that you can add a lot of that stuff later but to me a lot of that is _intrinsic_ to the writing in some cases. If for example I'm writing a book about using modern web features (I'm not), I want to talk _about the modern web features_ but also have examples that I can describe and explain around those examples. This dictates that I should ideally, at least in my mind, be building these samples in parallel with the writing. I am sure for some they can do without that but for me, this seemed like the most logical way to work and stay sane.

When you work on these examples, you inevitablly begin adding links, diagrams, code snippets, and more. You want all of these things, at least at a glance, to be compatible with the mediums in which you want to deploy. If you use too many screenshots of a web browser, it is hard to read in print. If you have too many links, they can be hard to follow along on a print book. You seemingly need to adapt the format depending on the medium and ensure it all works together. I'm sure you can bolt some of this stuff on after the fact but I've been in software long enough to know that that sometimes if you do the wrong thing up front, it can be really hard to change later. I figure writing the first manuscript is the hardest part but I've heard many stories online that the real fun only begins once you must edit, review, edit and finalize it which can easily eat another 100 hours.

Due to this, I just never really started seriously. Up until this point I've had nothing but a bunch of strewn together examples and notes in an Obsidian vault. Some hacked together diagrams and screenshots of things I wanted to explain were present, sure, but they were all mostly cobbled together in an evening when I had the thought and wanted to get it out of my head. Some people that have written books published their stacks online. Some looked pretty good but all of them seemed to require quite a bit of setup and a particular style for their style of writing. I just wanted to write the content, not setup an entire stack so it put me off. This probably sounds immature for someone that supposedly wanted to embark on a 500 hour task. I've maintained and written side projects for far more than those cumulative hours, so the commitment itself is not an issue. I think it's just that I lack a critical eye to evaluate which of these dozen stacks to use and whether they will save me time or not, or so I told myself.

I recently decided to pick it up using some LLMs to help accelerate the project infrastructure but _never_ the writing. I started with my Obsidian vault which I wanted to get rendered in a web browser where I could embed interactive snippets in addition to the notes. Within about 10 minutes, I found Hugo had a theme known as "Hugo Book" and some fairly simple config. I don't think this is [too novel](https://jacobian.org/til/hugo-obsidian/), there's at least a couple blog posts about this on the internet. I did add a few requirements though:

* I wanted to render the notes in a book chapter format, and I needed the notes cleaned up to reflect that
* I wanted the source of truth to be this vault
* I wanted hot reloading

Probably within 5 minutes I had a custom working setup with my existing filesystem without needing to do much. Then, with a few more prompts I asked for an ePub pipeline and PDF pipeline based on Pandoc to be added to output those. I iterated on the styling from the markdown notes a little bit until it started to look decent. Then, a few more prompts and I asked for a few more things:

* Create another Hugo application that bundles my loose demo examples into a browsable demo gallery sorted by chapter
* Convert markdown demo slugs such as `example-demo-foo` into embeds, links and references for the various media types
* Build a pipeline to rasterize SVGs and other elements for the various elements

Then I started writing for about a week and made a ton of progress. I was able to view changes after each rough draft chapter and make sure that things roughly seemed okay in each medium. I don't know if I'll use each medium or even finish but I no longer have the fear of "wow, I'm stuck forever". The stack was virtually free to bring up, ephemeral if you will. I don't understand how all of it works and that's okay. It's not designed to be a permanent stack, just enough to get a PoC working and then thrown away. I say _ephemeral_ and not a prototype because I want to treat it as short lived. Prototypes all too often promoted directly to production. For me, ephemeral is fleeting and has a short lifespan. Sometimes, it is completely re-written to accommodate new features. For example, my demo application gallery was originally using a different stack that I out grew. It was okay, throw it away and remould it like sand to fit the task at hand. If I decide to go with a publishing agency or one will accept me (assuming I even finish), they'll surely have their own stack and I'll happily throw all of that away without feeling like I lost anything.

(Of course, this is all predicated on the fact that LLMs cost ~virtually nothing for consumers to use right now for the kind of value you can get.)

LLMs are also very good at pattern matching. It has been very easy to perform tasks like "Go check all the code snippets used throughout the book and make sure they align with the demo" after a session of writing with a pipeline of skills and prompts. It's been great, it has let me focus on what I wanted to do: writing.

It's ephemeral and that's great. I think LLMs are perfect for this.

And yes, before someone asks a lot of the demos so far have been LLM assisted with a lot of human care to remove bloat to ensure they were minimal enough to show _exactly_ what I wanted to describe. LLMs still suck at this, no matter how hard I try I seem to enough with _too much_ code. I've been having pretty good luck forcing things to be simple and only use classless [CSS like Sakura.css](https://github.com/oxalorg/sakura) but I'm sure I'll have some work to do there if I decide to finish. I'm still need those 50 - 150 hours at the end to finish, I'm sure. As for writing, I'll stick to doing that much myself. While I'm not against LLM assisted writing, I fear in many ways we've taken that too far for art.  Rest assured, these words are written by me on my new Macbook Air M5. A post on that to come soon. :)




