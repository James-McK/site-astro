---
title: "Running a fediverse instance: The technical side is the easy bit"
description: People are a lot more difficult
published: 2024-07-18
updated: 2024-11-26
previewImage: ./fediverse.avif
---

This blog post is a couple of thoughts on running a fediverse instance after growing one from a single user instance to a community of about 20 friends over a year and a half - a few things I think went well, what I could've done better, and a caution that it's not as easy as I originally thought it would be.

This isn't a blog post to explain the fediverse. In short, it's a social network that on the backend functions similarly to email, in that people can be on different providers (gmail, icloud, etc) and still talk to each other. (Although the fediverse is a lot less centralised than email, with thousands of instances of all sizes)

## The easy bit

There's not too much involved in the technical side, at least on the small scale. (when things scale up it definitely gets a lot more complex - admins like Jo on tech.lgbt deserve a lot of thanks for all the work they do to keep an instance of that size running smoothly)

Initially setting up fedi software confused me a bit, having never really hosted anything myself before, but following the documentation got me going fairly quickly, and as far as I know it's only gotten easier since then (some instance software seems to have added install scripts to make the setup as easy as possible, which is great for helping people get started!)

Ongoing maintenance didn't involve much either. Updates are easy and only take a couple of minutes. Even when I chose to migrate the whole instance to a dedicated machine (hosting others who are popular and post _hard_ means a noticeable spike in CPU usage every time they post), everything went smoothly and everything was back up and running within an hour.

There were some mysterious ongoing issues even the developers seemed to have no clue what to do about (nobody seems to be sure if pleroma/akkoma database "rot" is real or not, and it is only spoken about with superstition and in hushed tones, in case it might overhear), but everything still kept working.

I don't bring any of this to say I'm good at the technical side of things, but as a caution: **_Being able to handle the technical side of things is not enough for running an instance with other people on it!!_** You can find the technical part easy, and still find running an instance to be a lot of work.

## The difficult bit

No, the difficult bit of running an instance is the social side - everything that comes with providing a platform for others, and being part of a much wider network of instances containing over a million accounts.

As I see it, handling a fediverse instance has 2 parts:

- Managing everybody on your instance
- Managing everybody on other instances

### On your instance

Managing an instance well can be a lot of work, so I tried to keep things as easy as I could for the first part by limiting the number of people on the instance, and only accepting others I already knew and trusted on to the instance (mostly it was folk asking if they could join the instance after we got to know each other, and a few being ones I invited myself)

This meant a few things:

- I could trust them to not cause too many issues for me - not having to worry much about getting and handling reports is great
- Everybody there shared me as a friend - people I get on well with seem to get on well with each other, even when they're very different, so it minimised drama within the instance. As a whole, it was a comfy and cosy space
- If an issue with another instance did occur, it usually meant either:
  - I was happy backing the person on my instance, and try to talk with the other instance's admin to resolve the issue
  - or it was some minor issue that I could send a quick message to the the admin of the other issue to resolve

However it also comes with the fairly significant downside that when there is a legitimate issue or drama, it's been caused by somebody you're close friends with. Depending on the scale of the issue, it can be emotionally exhausting to navigate and deal with.

Building a community is also part of it - a good instance feels like it's more than just a collection of accounts that happen to share the same server. I think it was the most important thing that made my instance so special, to me and others. Leading by example as what you want to see in other people seemed to work for me.

I didn't originally intend for anybody else to be on my instance (it was something I set up for just myself, but then a friend asked if she could move to my instance, and it grew from there), so I didn't have any rules to start with. When a couple people joined I threw a basic set of rules together (no transphobia, racism, harassment, etc), but with so closely limiting who could join in the first place, they served more as a set of guidelines for what other instances would be defederated for, rather than being needed for anybody on my instance. If you don't feel like coming up with your own set of rules from scratch, you can do what I did and mostly copy the rules from an instance I trusted. Speaking of:

### On other instances

Unless you've had to do content moderation on the wider internet, I don't think you're aware of how awful it can be. You will see things you will wish you had never seen. That's as much detail as I'll give here.

For the most part I tried to be as proactive an approach to moderation as possible possible, which I think was a fair part in maintaining the comfy atmosphere of the instance. If you can, try to keep a close eye on everything going on in the rest of the fediverse, although remember you can (and **need to**) also take breaks.

I also put the work into maintaining and verifying my own blocklist for the instance - this takes a lot of work, and is one of the things that led to me completely burning out. My suggestion is you either:

- don't try to do everything yourself! You can get other people to help you. If I ever wanted to try running an instance again, this is the approach I'd want to take.
- rely on the blocklist of another instance/group of people you trust (not my preferred option, as I had bad experiences with my instance ending up on some trusted blocklists, and even the managers of the blocklist being unsure as to the reason, although if it works for you then great)
- acknowledge that your moderation will be reactive rather than proactive (if the people on your instance like this approach then great, I've seen it work really well on other instances)

I'd also recommend being as transparent as you can about moderation decisions to everybody on your instance - I understand wanting to keep your instance's blocklist private to avoid scrutiny, but being transparent to the people on your instance about the moderation decisions you're making, why you're making them, and being open to disagreement is not only the right thing to do in my opinion, but it also shows them the work you're putting in to keep everything running, and helps them trust you running the instance.

## Did my approach work?

![Well, this has been the nicest place I've ever had the pleasure of inhabiting on the internet but it's time to migrate away. Thanks for running this place Autumn, it really did feel like home.](./positive-1.avif)

![0w0.is is shutting down in 3 months. I've hopped instances quite a bit since joining fedi last November, but 0w0.is has been a very special place to me. For the first time I found somewhere out of anywhere that had a homely feel to it, where I felt comfortable to make any random noise that came to mind. The other beings here are amazing and I'm fortunate to have met all of them through here. Autumn has been the best admin I could ask for, always being vigilant, sensible, and understanding in all the drama that affected this place. She's cute and wholesome and adds all the emojis I ask for and she's super cute](./positive-2.avif)

![0w0 is a community to me, and one of the most banging places on this Fediverse. Everyone who is and has been on here is righteously funny and amazing. This has been the coolest and cosiest place I have ever had the privelage of existing in, second only to being with my IRL friends. This is no small part due to the tireless work of Autumn. She is a wonderful person, a close friend, and one of my top sisters. But not only that, she is the pinnacle of being an admin. Autumn was responsible for creating this community and I applaud her totally. May she enjoy her break.](./positive-3.avif)

![It has been a wonderful few months since I migrated. I am extremely thankful to the work Autumn has done on 0w0.is - while I've beebn one of the most recent creatures to join the instance, and even though I may not have interacted with everyone in here, I appreciate how cozy and frankly welcoming my time on here has been. I am understandably a bit sad seeing all of this go - but I am glad I can look back on every interaction I've had in a positive light.](./positive-4.avif)

![0w0.is has been the comfiest online space I've ever been in. I dont just mean fedi instance - out of any internet community I've been a part of, 0w0.is has felt like the safest, nicest, coziest space I could've ever asked for. Autumn did an amazing job with handling this instance and I think every instance admin should aspire to get to the same level 0w0 was at. This instance felt so friendly and charming, Autumn harbored a really great community here. It's gonna be sad to see it go.](./positive-5.avif)

Yes.

Not really much more to say here. Managing to create a space that got these posts is something I'm indescribably proud of.

## Ending

Looking back, the main thing I now think I could've done better is to get help from others. I tried to run everything by myself, and although I did it well, it completely exhausted me and burnt me out, taking many months to recover. Having other people to help would've allowed me to feel like I could take breaks, and made running the instance sustainable. I hope I've learnt from this.

I've tried to write something about fedi a couple of times now, but not managed to get something that feels right and fully contains my thoughts on something that took quite a bit of my time for a year or so to run. I'm happy enough with this post, covering a small aspect of the whole thing at least. Rest in peace, [0w0.is](https://0w0.is/).
