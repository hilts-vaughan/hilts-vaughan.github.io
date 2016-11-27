---
layout: post
comments: true
title: Unlinking MKVs on Windows, OSX, and Linux - Native C# Port
categories:
- blog
---

You may have seen my [other post](http://vaughanhilts.me/blog/2015/04/30/unlinking-mkvs-on-windows-osx-linux.html) on unlinking those pesky segmented MKVs that I posted a while back. Lots of users have tried it out and it works pretty well -- however, the original Perl port had a few issues with it. Mainly:

1. It required a lot of dependencies that Windows users weren't used to having, such as "Strawberry Perl" since it's not something that runs on Windows "natively"
2. It had a couple bugs that were hard to fix, since I am not a native Perl programmer. This made it hard to make it work for every release I wanted.
3. It made some assumptions about the process that have since been fixed.

Since I was still getting bug reports well into 2016 about certain MKV files not working with the process and I was having some bugs myself with certain files, I decided to rewrite a quick native port in C#
of the actual merge logic in order to work around these three issues.

# Brute-Force Linear Ordering

The biggest bug I had to deal with was files that looked something like this:

<pre>mediainfo file.mkv
Menu
00:00:00.000                             : en:Prologue / en:Opening / en:Ending
00:05:57.019                             : en:Episode
00:22:40.059                             : en:Preview</pre>

------------------

MKVUnlink (Perl) was handling these pretty good but would occasionally trip up on these. If you look at the order inside the actual MKV itself, the chapters are presented in sequence but their timecodes are all wrong. I'm not sure if there is something I am not understanding or if this is just a bug in the way they were split out. A lot of media playback software that actually supported segmented playback actually worked find with these files so I was not sure. However, the algorithim I was using and that UnlinkMKV was using simply did not work sometimes for these files.

The solution is to linearize these, you see the implementation online at [Github](https://github.com/hilts-vaughan/UnlinkMKV-GUI/blob/master/UnlinkMKV-GUI/UnlinkMKV-GUI/merge/SegmentTimecodeSelector.cs) but the basic premise is to just take the order the chapters and for each:

1. Measure the duration of the current clip
2. Set the start timecode of the current chapter to the end timecode of the previous
3. Then, make the ending equal to the duration + the start of the old timecode

This will make everything nice and linear. The process only has to be carried out if the sequence is kind of out of order. Either way, this fixes a few issues with a couple MKV files that were giving me grief.

You can download this new release on Github today [here](https://github.com/hilts-vaughan/UnlinkMKV-GUI/releases/tag/0.2.0) which contains quite a few of the bugfixes. I hope in the future, every player can just support the segmented format and we won't have any need for software like this. For now, if you find any bugs please leave an issue open on Github.

To use the new "Native Mode", just tick the "Native Mode" in the GUI.

Any feedback? Experienced a similar issue? Feel free to post about it below in the comments.
