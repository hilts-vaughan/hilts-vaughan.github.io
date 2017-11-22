---
layout: post
comments: true
title: You need to learn to navigate code
categories:
- blog
---

# You need to learn to navigate code

Often when we talk about productivity of developers, we will measure various outputs. In the worst places, this metric might be lines of code. In better ones, it will be bugs density, features completed, support requests answered. Often, to get better at these we will reference things like better software design, maintainable code, unit tests,  and more. Some of these focus on letting other people read our code in a more efficient manner and others just help us write better code for ourselves. The best will do both. There is another side of the equation, though.  We write readable code because we know that eventually someone else will read it, even if that "someone" is ourselves.  The thing we neglect to also talk about sometimes is that being able to **read your code in an efficent way** is almost as important.

## Learn your IDE shortcuts and make use of them

This might sound obvious. It might even seem like it goes without saying.  However, I have witnessed many developers that simply do not use any hot keys or know the shortcuts to navigate their editor. They do not use any shortcuts. When you are reading a dense chunk of code, this can cost you minutes that will add up in a very long session. These days, I do mostly web development so I will be speaking mostly from that perspective. I use **Atom** and **Visual Studio Code** as my main editors  and feel comfortable talking about these. Even though I prefer **Visual Studio Code** more nowadays, I focus a lot on Atom since I think a lot more developers still use it. It's very popular and because of that, I feel like a lot of people use it without actually configuring it properly.  It is *is* possible that this phenomenon is exclusive to web developers but I have a feeling it can be applied to others, too. I feel like developers with full IDEs are more aware of these kinds of things, especially in languages like Java where the tooling has been very good for a while now.

These are some things you need to learn to use, else you are severely missing out:

1. **Jump to method **. If you are pressing `Ctrl + F` to find a method inside of your code, you are doing it wrong. Most IDEs and even text editors, such as Atom (with the proper language server / support) can jump straight there. For example, in Atom, you can do this with `Ctrl + R` (at least on Linux) There are numerous advantages

   * The search is often fuzzy, so you only need to recall a few characters
   * You can see all the symbols in one view, so you can flip through them fast if you need to often
   * You can get there by just typing some characters instead of scrolling and then positioning the cursor
   * You only get **definitions** and not all the usages as well and then need to read each result you get if you were to have done a search

   ​

2. **Go to file / class**. This is also a big one that I see a lot of people use already and it is rare that I do not see someone use it. Hunting for a single class or file in your structure is painful and could require dozens of seconds to get right, depending on how large your project is. `Ctrl + Shift + F` is not the right answer ==  instead, use something like `Ctrl + P` in Atom or `Ctrl + O` in Jetbrains IDEs. 

   You get something like this:

   ![https://www.jetbrains.com/help/img/idea/2017.2/gotoFile.png]()

   ... and now you get somethign that can help you find a file very quickly.

3. **If your tooling supports it, learn your quick navigation tools such as "Go to class" or "Go to definition" when you have a word selected.** Visual Studio Code has good support for this.

In fact, there are a ton more. These are just some of the very basic ones that kill me I see someone not using them. Atom does not support much out of the box but Visual Studio Code supports a ton more. I do not need to repeat much more of what is already available. Just read the documentation for your IDE if you have not already. Scour the web, people have summarized their findings for you.

I'll put some links below to some good articles on getting the most out of your IDE for code navigation:

* **[Visual Studio Code](https://code.visualstudio.com/docs/editor/editingevolved )** 
* **[IntelliJ](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html)** 
* [Visual Studio, random shortcuts from SO](https://stackoverflow.com/questions/1888161/navigating-through-code-with-keyboard-shortcuts)
* .. and there's more. You can find them all from a simple search with "your favourite IDE" + "code navigation"

Just learn your keyboard shortcuts.

## Spend some time setting up your environment to your workflow

These are just a few things I have done to my **Atom** install. For each thing, I identified where time was being sunk into and then make changes to make things less cumbersome.

1. **Select the file in the tree view you are looking at by default** *( Settings > Tree View > 'Auto reveal')*: If you are exploring new code, there is a chance you will be looking at files grouped in a similar package or module. If you are using your keyboard to hop between files as you find them you  might want your file finder to follow you as well. Some Jetbrains IDE have this feature as well which is disabled by default. This will save you time from hunting down the file or executing the "Show in tree view" command (once you figure it out...)
2. **Look into tools that can provide you extra value. ** For example, in **Atom**   we do not have a fully fledged IDE available but there are plugins that will make a big difference, such as **TernJS** for Javascript which allows us to get some "type hinting" on code that is not annotated. 
3. **Rearrange Windows if you have multiple monitors, make use of them.**  I was guilty of this one for a while. I would be making use of only one monitor when developing and using the other for documentation. On a 1080p monitor, I thought of better things to do with a 2nd monitor then holding a browser I would look at 'sometimes". The stock configurations for most environments are not suited for dual monitors, let alone multiple.
   1. Unit Test Feedback that I can glance at from time to time to make sure nothing is broken
   2. Console ouput that can be monitored
   3. The running application when doing web development, so I can see the change in front of me
   4. ... anything else related to the current task'
      ​
4. **Find a colour scheme for you that makes it easy to differentiate things** This one is simple but makes a big difference. Make sure the colour scheme you are using is providing you value and you can tell things apart.

There are tons of other things you can do. The web has covered them all everywhere and there is no reason to repeat everything that has been blogged to death. Instead, I beg, notice what you are doing and what is taking forever. Then, you should find a way to fix it. Just by changing up a few things, I saved myself a lot of frustrating and got some very helpful hints while reading code.

## Yep, that's it

Yeah, that is really all I wanted to say. All this information is already available elsewhere if you are looking for it but nobody talks about this in academics. In school, you are not taught to learn about your tooling all the time. (At least, I was not) If you have good co-workers, they will probably point out your inefficiency when they see it. If you are self employed, you will need to discover this on your own. You know, most people already know this stuff. But I hope this will reach someone out there whom never considered it.

Happy reading and navigating.