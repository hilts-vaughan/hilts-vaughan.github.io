---
layout: post
comments: true
title: Setting up Huginn on unRAID
categories:
- blog
---

I recently became intrigued with using Huggin for a few automation tasks I had been doing manually up to this point. However, it looks like nobody to this point had bothered to really post how to set this up with unRAID. It was not too tricky since you can use **Docker** with unRAID but there were a few things that slowed me down. 

I'm documenting them here for anyone else who wants to do this, you can hopefully be saved some time.

## Get an unRAID Huginn template

As the first step, you're going to to need a template to do this since unRAID makes use of Docker templates for setting up things quickly. I created one you can use [right here](https://github.com/hilts-vaughan/unraid-docker-templates/tree/master/unraid-hilts-vaughan-templates) if you don't want to create your own. That template assumes you have a `appdata` mount point already existed for your other applications. If you don't have one already (this is your first docker app in unRAID) then [you can read this to get more info](https://lime-technology.com/forums/topic/55263-how-should-i-set-up-my-appdata-share/).

If you are using my template, you can follow the below directions:

1. Go to the "Docker" tab in the unRAID interface
2. In the "Template Repositories" at the bottom of the page, add my repository which is at `https://github.com/hilts-vaughan/unraid-docker-templates/tree/master/unraid-hilts-vaughan-templates` and then hit "Save"
3. Click "Add Container" which is a button on the Docker Page
4. Select my template from the dropdown  above, to be prompted with something like this:

![](/assets/8c060306-fd8a-45a5-8736-2cb77c089c79/1.png)

5. You can accept the defaults and let it pull down -- which should give you a working instance once it comes up at (by default) `tower:3000/`
6. Login with the default credentials of `admin` and `password` -- make sure you have saved these. 

## Getting email working

I had to do a couple things in unRAID land to get this working properly as it was not working out of the box.

**Configuring the user in Huginn**

1. Once signed in, head to `http://tower:3000/users/edit` (you can change the `tower` if you changed the name of your unRAID box)
2. You should see no e-mail in the box -- so you can configure one, like so:

![](/assets/8c060306-fd8a-45a5-8736-2cb77c089c79/2.png)

Then, you can hit "Update"



**Configuring unRAID with environment variables**

If you plan on using GMail for the e-mail in Huginn, you may want to read the below section first. To configure environment variables, and email specifically for Huginn, you can use the following steps at the time of publication (tested for GMail):

1. Go to your "Docker" tab
2. Click edit on the image
3. Using "Add another Path, Port, Variable or Device" at the bottom of the page, configure something like this:

![](/assets/8c060306-fd8a-45a5-8736-2cb77c089c79/3.png)

![](/assets/8c060306-fd8a-45a5-8736-2cb77c089c79/4.png)

If you want to configure anything else at this point, you can [refer to this environment variable documentation to do so](https://github.com/huginn/huginn/blob/master/.env.example).

**Configuring GMail**

If you are using GMail, there are additional steps go through to generate something secure and that is usable for Huginn. I was getting some interesting errors like:

```ruby
huginn rbuf fill
```

... and authentication errors among other things. In practice, if you plan on using this for any amount of time I would advise you sign up for something like Amazon SES or something with a very basic (or free) SMTP server you can use and then have them send your emails for you. This will give you a layer of insulation against having your e-mail credentials served. 

Otherwise, do this:

1. [Enable two factor authentication](https://support.google.com/accounts/answer/185839?hl=en) for your GMail account. This is not strictly needed but this guide will use it since it allows you to generate app specific passwords which are needed to keep your unRAID box from knowing your actual credentials.
2. Generate an [app password](https://support.google.com/accounts/answer/185833?hl=en)
3. Use this password in the above steps, where it says "PASSWORD" use this disposable password. It's slightly more secure and lets you bypass some of the "Use less secure apps" mode that some articles talk about. **Do not use this mode if you can help it. It's insecure, as the name implies.**

**Testing it**

To test this, I would just run a couple of the default agents and see if it works. The easiest way to do this is:

1. Run the [iTunes Trailer Source](http://tower:3000/agents/6?return=%2Fagents)
2. Run the [Afternoon Digest](http://tower:3000/agents/3?return=%2Fagents) agent
3. Check if your e-mail was sent successfully

------------

That should be it. I hope this saves you a couple hours. I wish someone had told me about a couple of these things when I started (and that a unRAID docker template existed!)