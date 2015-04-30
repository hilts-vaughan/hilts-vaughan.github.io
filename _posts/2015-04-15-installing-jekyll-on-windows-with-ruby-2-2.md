---
layout: post
title: Installing Jekyll on Windows with Ruby 2.2.2
categories:
- blog
---

Before migrating my blog over to Jekyll, I did some research and found Jekyll was probably a fairly matured static
generator that had a fair degree of running on Windows with no issues. Actually, it was [this guide in particular](http://jekyll-windows.juthilo.com/1-ruby-and-devkit/) that
I followed mostly. Though, if you have as much bad luck as me sometimes, well you'll probably run into a snag using the latest version of Ruby; for me that's the 2.2.x revisions.

---

# Issues with Hitimers

## The issue

If you receive the following error when trying to run `jekyll serve`:

`C:/Ruby22/lib/ruby/2.2.0/rubygems/core_ext/kernel_require.rb:54:in 'require': cannot load such file -- hitimes/hitimes (
LoadError)`

Then, chances are you just need to run the following commands in your command prompt: 


`gem uni hitimes` 

`gem ins hitimes -v 1.2.1 --platform ruby`

## Explanation

It would turn out that typically, there is a fat binary that is rolled into the gem installation of hitimes. However, hitimes has only been around since January and
the [authour hasn't yet released](https://github.com/copiousfreetime/hitimes/issues/40) a [fat binary](http://en.wikipedia.org/wiki/Fat_binary) for it yet. Basically, there is no Windows support.
Running the above code, we'll get around the issue until hitimers has an update.

[(Credit to this Stackoverflow answer for the solution.](http://stackoverflow.com/questions/28985481/hitimes-require-error-when-running-jekyll-serve-on-windows-8-1))