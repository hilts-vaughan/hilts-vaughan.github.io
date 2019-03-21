---
layout: post
title: Why are we still not enforcing our invariants in 2018?
date: 2018-04-12 23:11 -0400
---

# Motivation & why you should read on

Before you read much more, here's a summary of what you can expect:

* At least in some circles, we need to figure out how to enforce the invariants of our code better
* Often, libraries (even very popular ones) do this very badly. We can do better -- and it's not that hard to do. It might just require some education on the tools available to us. 
* We're going to look at some real case studies of where poorly enforced invariants cost me real time. That's real money for someone. 
* **We're going to look at why you might as well document assumptions and decisions as hard enforced constraints**

# Preface

It's no secret that I work a lot in JavaScript. If you look at my GitHub profile, you will find no shortage of projects there that I've written in JavaScript and I've been writing it professionally for a number of years. Let that be a preface -- I have worked in .NET, Java and other languages as well but I want it to be known that this very well might be a rant against the state of Javascript. I definitely know some languages handle this better 

I...

* Have written many commercial enterprise applications and features in it
* Used a ton of libraries, frameworks, APIs and the like that interact with the ecosystem as whole in it
* ... and I'm a huge shill for static type systems since I come from a .NET background before delving into the web

In other words, I've worked with other peoples code a lot. I've invoked a lot of API(s). I've poked and invoked tons of external systems. I've played the integration system. 

More importantly, though:

* I've also written a lot of code in .NET (quite a bit of it, I wrote a few games, game servers, and a couple non-trivial back-end web applications in .NET Core as well)
* I've been on the end of being frustrated by poor API(s) that suck a bunch of my time as I try and debug what I did wrong (or the library in some cases is not documented properly)

The last point is the one I want to focus on today since it's probably wasted hundreds of hours over my life. Specifically, I want to talk about poor type systems, invariants, why we don't enforce them, why we should, and how we can do better even in languages such as JavaScript that don't support them.

Let's get started.

# Introduction

**If you already know about invariants, I implore you to skip this. It's boring stuff. You can skip to the examples below of insanity.** The definitions below are far from Academic and they're drawn from experience. Some places, such as the [Code Contracts](https://docs.microsoft.com/en-us/dotnet/framework/debug-trace-profile/code-contracts#invariants) documentation will point out the difference between *Preconditions*, _Post Conditions_, and _Invariants_. I am not interested in such differences for the purpose of this post: I just care about valid state, all the way through. 

I don't want this post to be too long but I do want to spell out what it means to violate an invariant. Invariants are things we expect to be true about the lifetime of some unit of encapsulation. There are more advanced definitions but there are some simple examples we can derive. We'll talk about functions since they are applicable to all languages without needing to worry about the specifics of OOP, Prototype Inheritance, Functional etc. _Most_ languages have functions. Not all of them have classes -- and it's the smallest unit of work we can deal with.

**A word on validation vs invariants**: Validation can definitely enforce invariants, preconditions and more. However, often for a piece of code it might be too late. Validation usually implies some kind of deferred handling -- which is sometimes _too late_ as we will explore after the _Introduction_. We are more interested in immediately, observable 

* **Nullability and buffer lengths.** Let's talk about these since they're so easy to pick on. Validate your buffer lengths and the optionality of something. A large portion of the world does this now but still we have a ton of exploits involving these on a daily basis. Still, modern languages such as Rust, Swift and friends make this very hard to mess up. We're moving forward.


* **Proper data type.** The most basic (and arguably, this is a loose definition but it should be easily digestible) is validating your data types for a parameter into a given function. If you have an `add` function, you probably want it to take some integers. It might be an array, two integers, a variable length splat of integers (if your language supports such a construct) or any other set of parameters.  However, the important thing is it's decided what is supported and what is not. If we are to enforce this, we enforce the type.

  There are a couple ways this is done. Static typing or run-time assertions are just two possible options.

* **Single Domain invariants**. I classify these as things that are specific to something about the domain of how a piece of data is being used. A simple example is _Percentages_. If you have some floating point number (or even fixed point arithmetic operation) that you need to bound between some values (probably 0 and 100, if you are dealing with standard ones) you should go ahead and apply some invariants here. This means the value should not exceed 100 or be less than 100.

  There are a few ways of accomplishing this. For example, Ada has a [range](https://en.wikibooks.org/wiki/Ada_Programming/Types/range) construct you can use to create bounded integer value. In Javascript, the only choice we might have is to write something like this:

  ```javascript
  if(value < 0 || value > 100) { throw new OutOfRangeError('The value given ' + value + 'was out of range'); }
  ```

   [Code Contracts](https://docs.microsoft.com/en-us/dotnet/framework/debug-trace-profile/code-contracts) for .NET provides something similar and a bit more automated. We're not going to dive into the specifics here.

* **Class invariants. ** This is a classical OOP type -- we touch upon it quickly here just because so many people are used to OOP. [Wikipedia](https://en.wikipedia.org/wiki/Class_invariant) has a pretty good article on this but the gist is _things that must be preserved across the larger unit of works lifetime_. For example, if you had a class that held a `startDate` and ` endDate` and it should enforce that the `startDate` should always be before `endDate` (the reverse is true, too) but you exposed two setters, `setStartDate` and `setEndDate` -- then you would want to make sure this rule held and would need to examine both pieces of state in most cases. 

As an aside, there a lot of different ways of tackling invariants. Some design methodology (looking at you [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) actually gives some recommendations on how to do this depending on who you ask. We're going to focus more on why you should do this more than _how_ you should do it and how it can save a ton of time. At the end of the day, we're going to be talking about **documenting your assumptions in code.** This might sound obvious but let's look at what happens when we don't do these things with some real code that has cost people time and money.

We can look at solutions later, I find the problems will convince people to go "Ooo, I've experienced that before! I thought this was just normal". 

# The cost of assuming without documenting 

**Buffer overflows**

The first kind of assumptions that we don't validate that cost us all money that we encounter all the time is the classic [buffer overflow](https://en.wikipedia.org/wiki/Buffer_overflow). Sure, this can only happen in a subset of languages in most circumstances but it illustrates a good example of where your bad assumptions can cost real money. Let's look at all the damage buffer overflows have caused over the years. In no particular order:

* [The “unpatchable” exploit that makes every current Nintendo Switch hackable](https://arstechnica.com/gaming/2018/04/the-unpatchable-exploit-that-makes-every-current-nintendo-switch-hackable/) - 2018 (details unclear, but definitely some kind of overflow attack)
* [Buffer Overflow Found in PSP Firmware v2.0](https://games.slashdot.org/story/05/09/24/1917246/buffer-overflow-found-in-psp-firmware-v20) (this wasn't the last either...)
* [The PS4 was partially comprimised through buffer overflow via Webkit](https://cturt.github.io/ps4.html)

These focus on game consoles and they are only some of the most basic examples. I talk about them since a lot of them will and did in the past open the door to piracy. No matter your stance, the impact is not zero on the industry. Money is spent on legal departments, patching, PR, and more handling these things. 

Depending on the systems, not handling some basic checks like this cost a ton. 

**Null pointers, null references, and friends**

There's a lot of things wrong with null pointers as we have learned over the years. There's some good articles on-line ([here's a decent one](https://www.lucidchart.com/techblog/2015/08/31/the-worst-mistake-of-computer-science/)) that explain why this is the case and [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare) himself even indicates that:

> This has led to innumerable errors, vulnerabilities, and system crashes, which have probably caused a billion dollars of pain and damage in the last forty years.
>
> Tony Hoare, inventor of ALGOL W.

Oftentimes (arguably always) these just occur because something was assigned `null` (or defaulted to) when people assumed they would not be. Simple to validate. Not often done. Tons of damage. Poorly handled  null references can take crudely designed systems down. The most robust ones will behave wrongly. 

[This is an interest read on gaining root with `null`.](https://blogs.oracle.com/linux/much-ado-about-null%3a-exploiting-a-kernel-null-dereference-v2)

**OK, extreme examples, commonly known problems aside, let's talk about the other large problems. **

Buffer exploits. Null pointers. Improper authentication. All bad things. These are bad from _security_ but for a typical CRUD app running in your browser, maybe no big deal. But there's a larger story here. 

# What can we do about it?

* Design good APIs that easy to use -- but this is just a first step. 
* Document your assumptions and fail fast when someone breaks the promise
* Use languages with good support for these invariants
* ​

# A word on tests

I just wanted to make this a section on it's own really fast since I often get this argument. Specifically, I want to attack Unit Tests. Often, I will get the argument: _"The tests pass -- and the tests do the validation and document the values that are valid. If you want to figure out how to use it, you can look there. "_ 

I just want to make a few arguments. If you disagree, this might not be the article for you and that's OK.

1. If your tests are just testing known, good input, but do not cover if something is handling bad data (in the absence of a proper type checker at the most basic level) then you still have not solved the problem with users of your API who misuse it without realizing. That leads me into...
2. Users do not read your tests. They read your documentation, if you are lucky. In a lot of cases, the documentation either does not exist, is old, incomplete, does not work properly, or worse: it's incorrect. Your code will not be incorrect (hopefully)
3. In some languages with a good enough type system, tests that probe the behavior of some these  are actually just brittle and harmful. It does not excuse writing good code. 