---
layout: post
title: Unlinking MKVs on Windows, OSX, and Linux
categories:
- blog
---

For the longest time, the video format of choice was XVID or other types of encodings held in AVI containers. Howevever, more and more internet content is being distributed in Matroska (MKV) containers. While being more efficent and typically being used with some very good codecs like H264; there has been a price to pay for some slashing file sizes. A large trend of late has been to cut media files into several files and make use of the MKV linking feature to insert segments of video into mutliple files, while only storing it on the disk once. This sounds pretty great in theory but some of my media players of choice like [Plex](https://plex.tv/) do not support that part of the spec.

So, I set out for a way to unlink and put these files back together. There's a great project called [UnlinkMKV](https://github.com/gnoling/UnlinkMKV) written in Perl that did what I wanted to do. It does not run on Windows or OSX properly completely at time of writing, so I set out to port it and create a pull request. I didn't want to settle for just some command line script port, though so I went overkill.

I developed a full GUI interface overtop that can be used by anyone to solve this pesky linking problem. Details on how to use it below.

---

# Using UnlinkMKV-GUI

It's a portable application running on the .NET Framework / Mono, you can grab the latest release [here](https://github.com/hilts-vaughan/UnlinkMKV-GUI/releases) and read the setup requirements [here](https://github.com/hilts-vaughan/UnlinkMKV-GUI/blob/master/README.md) for your operating system. Setup basically boils down to having Mono, a working Perl install, and MkxToolNix. If you know you have these already, you can move along. Otherwise, feel free to follow the guide for your operating system in the README.

If you're on OSX or Linux, after downloading the release you can just run it with `mono UnlinkMKV-GUI.exe`

## Using the application

If everything is good, you should see a screen like below:

![interface](/assets/posts/unlinkmkv/start.png)

Select the folder where your segments (linked video, along with the connecting segments) are for the "input folder" and then select "output folder" to be the folder where you want the merged files to be output. Then, just click **"Unlink"**!

With any luck, just a bit of waiting will be all that is required to have your files waiting in output. If it has some problems, the following options below are available and described. If they still cannot fix your problem, cut me an issue on GitHub and I will try and get it fixed up.

* Fix Audio/Fix Video: These will transcode the video into a new format. This isn't really reccomended and only required in a few cases. The unlinking will take a long time and you will lose some quality.
* Fix subtitles: If the subtitles don't appear in the finished product, try ticking this.
* Ignore default flag: Same as above, try ticking this. 
* Ignore missing segments: You can use this if you're sure you want to skip missing segments
* Verbose Output: You should use this mode when attaching a log for a bug report, will include important developer information

Thanks to Garret Gnoling for the original release. Pending pull request approval, the original script should be updated for cross platform, too.
