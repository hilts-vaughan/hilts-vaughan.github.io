---
layout: post
comments: true
title: Recompiling OpenSSL with SSLv3 Support on Arch Linux for use with .NET Core
categories:
- blog
---

**NOTICE: As of .NET Core 2, this is no longer a problem. If you can upgrade your project and you were considering it already, you might as well do it to avoid this problem if you are having it.**

I was recently working on a project for a client and was trying to use the new .NET Core technology by Microsoft. Of course, this is not a supported platform for my operating system of choice. However, that did not stop me from trying to run with it.

A lot of stuff works but Entity Framework does not out of the box. You will get the following error trying to run a query:

```
/opt/dotnet/dotnet: relocation error: /opt/dotnet/shared/Microsoft.NETCore.App/1.1.0/System.Security.Cryptography.Native.OpenSsl.so: symbol SSLv3_method, version OPENSSL_1.0.0 not defined in file libssl.so.1.0.0 with link time reference...
```

As it turns out, Arch Linux removed SSLv3 in this [commit](https://git.archlinux.org/svntogit/packages.git/commit/trunk?h=packages/openssl&id=4b82ed4285c7cb76caf6d75a015c5a7542c625d1). There are some solutions like recompiling your application
that is using the SSLv3 stuff and stripping it off. Considering my stuff was from the AUR and I had other packages that had this problem and I did not feel like recompiling them all to get my work done, I decided to just add the support back myself
until I could decide how to tackle it. If anyone else is having this issue and needs SSLv3 back to get this working, you can follow the directions below:

We'll apply patches to the `PKGBUILD` provided by the Arch repos to include SSLv3 support. This is important to note as some advice is to downgrade your package on various parts of the WWW. This
is generally actually a bad idea since OpenSSL often has security vulnerabilities. Being several years behind on security patches is far worse.

1. Install [`customizepkg-git`](https://aur.archlinux.org/packages/customizepkg-git/) from the AUR.
2. Create a definition for the `openssl` package to patch. To do this...

```
sudo nano /etc/customizepkg.d/openssl
```

**NOTICE / EDIT: ** It has come to my attention after upgrading my Arch Linux box, that the OpenSSL v1 has been replaced with OpenSSL v1 Compatability library from the AUR. So first of all, make sure [you have this package.](https://aur.archlinux.org/packages/libopenssl-1.0-compat/). Secondly, make sure you edit the the `libopenssl-1.0-compat` file instead, i.e:

```
sudo nano /etc/customizepkg.d/libopenssl-1.0-compat
```

instead.... continue on. :)

and then put the following contents into the above file (most likely the compatabiltiy file if you are reading this on an updated system post June 2017)...

```
replace#global#no-ssl3-method#zlib
replace#global#no-ssl3#zlib
```

3. Then, just do a system update or just reinstall SSL (`yaourt -S openssl`). You should see the diff shown and be able to just continue installing with support.
4. If this fails, you may need to install the `gpg` key for the package, i.e: `gpg --recv-keys D9C4D26D0E604491`
5. Once the build is finished (took a couple minutes on my i5 2500) you should have SSLv3 support

... and that should enable quite a few applications on Arch Linux that have issues with this to begin working, including .NET Core. If you don't want to enable this system wide, you can consider recompiling .NET Core's `corefx` assemblies
to accomplish this same kind of goal.

For me, this is enough for a development machine. I hope this helps others.
