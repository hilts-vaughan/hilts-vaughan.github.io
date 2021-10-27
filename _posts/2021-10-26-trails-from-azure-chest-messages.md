---
layout: post
title: Trails from Azure: Finding all the chest messages
date: 2021-10-26 17:17 -0400
comments: true
---

There is a fun tradition from back in _Trails in the Sky_ for Trails in the Chest that involves hiding fun messages inside of the treasure chests in some of the Kiskei games. [You can find some of these chest messages here](https://kiseki.fandom.com/wiki/Trails_in_the_Chest,_Part_2), such as the _Trails in the Chest_ series but no comprehensive list seems to exist anywhere. It turns out they are not too hard to extract from the game, so I thought it would be a fun evening project to extra the ones from _Trails to Azure_ since I just finished playing it and it was _fantastic_! I'll write about that later. For now, let's move on to getting those chest messages!

First, let's begin with just finding the _Trails in the Chest_ messages since they're easier to find as they have well known bounds and text.

Let's start with the following:

* I ran `strings` on the game scene files to create a dump from all the strings I could find. This is pretty easy to do since the files are inside of a single `data` directory and they're not compressed. Something like `find . | xargs strings > ~/workspace/dump` 
* From there, we could do all sorts of transformations on this data  A quick peek in `less ~/workspace/dump` shows us the following (mild spoilers from Azure):

```
#5CCongratulations on reaching the end.
You've got a long road ahead of you still,
but I know you can do it.#0C
```

This is one of the messages from the game. We can see that it has some codes between the text. These are probably font colour op-codes since it is shared with some things that aren't chest messages as well and they appear in a different font in game. For example:

![](https://external-preview.redd.it/ey2dPLaumoUlwyhr0B7JlIzkslEF0k3gLQ2DTKR14kM.jpg?auto=webp&s=fe2c60a0e470d982924a43cf39b2f5b006ce9705)

Skimming through the file reveals that some other non-chest messages inside of the file. However, for now there is no need to worry about that since we're just looking for the "Trails in the Chest" messages. They have some characteristics that make them easy to find:

* They start with [1/xx] etc, etc, one for each party of the story
* There is a fixed number of them

With this, we can just use `awk` to find them in the dump: `*cat ~/workspace/dump | awk '/#5C\[.\*\/.\*\]/,/#0C/'*`. This gives us all the messages of which you can find a sample of them below:

```
#5C[55/61] In Bose, cramped between two of the most popular
shops on the block, was a tiny, tiny building. Last year,
it had been in a terrible state. Cobwebs once adorned the
windows, and insect droppings were commonplace.#0C
#5C[1/61] You remember reading the teaser in Trails in the Sky the 3rd
for 'Trails in the Chest, Pt. II,' but you didn't think it'd ever come.
Yet suddenly, you have a craving for more Trails...in the Chest.#0C
#5C[6/61] The day of their wedding, she, beautifully pristine
to a distressing degree in his eyes, had marched down
the aisle at a stiff pace. When he lifted her veil, he'd
seen no joy in her expression.#0C
#5C[44/61] 'Oh, SHUT UP!' Genevieve hopped just enough to
grip it and pulled it downward. Both had their hands on
the chest now, and neither one appeared to have any
intention of letting go. And then, to Genevieve's shock...#0C
#5C[11/61] True love! Something out of fairy tales, yes, but
Cyril's heart always did pang with longing while reading
them. He was a romantic at heart, and now here he sat,
```

We could do some cleanup to make this easier to read but it's some simple regular expressions that we don't need to cover here. 

Now, how do we find _all_ the chest messages? This is a bit trickier and we need to observe the following things about the string dump:

* The chest messages can span at most 3 lines
* The chest messages tend to adjacent to each other in the string dump (since they are located close together)
* They always have the same font colour in the game

With this, we can write a short program to try and get the data out of our strings file:

```javascript
const fs = require("fs");
const b = fs.readFileSync("/home/touma/Downloads/ao/dump");
const msgs = b.toString();

let pageBuffer = undefined;
let pageCount = 0;
const pages = [];

const lines = msgs.split("\n");

for (const line of lines) {
  if (line.startsWith("#5C")) {
    pageCount = 0;
    pageBuffer = {
      msg: "",
    };
    pageCount++;
  }

  if (pageCount > 4) {
    // Give up on this message, lost cause and probably "garbage"
    pageCount = 0;
    pageBuffer = undefined;
  }

  if (line.includes("#0C")) {
    // End of the line, we can include this line and then start over
    if (pageBuffer) {
      pageBuffer.msg += line.replace("#0C", "").replace("#5C", "") + "\n";
      pages.push(pageBuffer);
    }
    pageCount = 0;
    pageBuffer = undefined;
  }

  pageCount++;
  if (pageBuffer) {
    pageBuffer.msg += line.replace("#5C", "") + "\n";
  }
}

for (const page of pages) {
  const { msg } = page;
  console.log(msg);
}

console.log(pages.length);

```

This gives us pretty much a perfect listing with some manual cleaning needed to remove some false positives. 

[The full output of this can be found here.](/assets/azure/chest.txt)

