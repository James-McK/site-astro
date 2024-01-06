---
title: New year, new site!
description: Almost two years, actually!
published: 2024-01-06
previewImage: ./new-site.png
---

Whoops, hi again! It's been a bit longer than I meant it to be since my last update to this site or blog post, and I'm here to fix that.

## New site

![Screenshot of the main page of the current site design](./new-site.png)

The new site is built with [Astro](https://astro.build/), and... that's pretty much it actually! I enjoy keeping my site pretty minimal, and the extra flexability writing my own CSS gives me.  
Why astro?

- It works well as a static site generator (I don't need to worry much about hosting for now when it's just a bunch of static files when built)
- It allows me to finally try something with more JSX-like syntax (not sure how I managed to avoid it for this long)
- It's flexible enough that I feel like I can do exactly I want with it, without me having to write everything from scratch
- It's powerful enough that I know I'll be able to extend it in future if I feel like making something more dynamic
- Takes care of making sure most images are optimised well enough

It also comes with some other nice features like syntax highlighting:

```cs
var text = File.ReadAllLines("input.txt");

// Advent of Code 2023 Day 6
// https://adventofcode.com/2023/day/6
// Part 1
var totalTimes = ReadAsSeparateNumbersFromLine(text[0]);
var distancesToBeat = ReadAsSeparateNumbersFromLine(text[1]);

var marginOfError = 1;
for (var race = 0; race < totalTimes.Length; race++)
{
    marginOfError *= MarginOfError((int)totalTimes[race], distancesToBeat[race]);
}
Console.WriteLine($"Part 1: {marginOfError}");

return;

long[] ReadAsSeparateNumbersFromLine(string line)
{
    return line
        .Split(' ', StringSplitOptions.RemoveEmptyEntries)
        [1..]
        .Select(long.Parse)
        .ToArray();
}

int MarginOfError(int timeAvailable, long distanceToBeat)
{
    return Enumerable
        .Range(0, timeAvailable)
        .Select(guess => CalcDistanceTravelled(guess, timeAvailable))
        .Count(distance => distance >= distanceToBeat);
}
```

A lot of this is also standard in other static site generators, but compared to my own previous custom solution, it's a whole lot of features!

I also took this as an opportunity to redo quite a bit of the CSS (e.g. [/blog](/blog) now looks significantly nicer), but I kept the bits of design I still like. (I actually think the old design still looks good! But for some parts I felt like doing something new)

I've also got a couple of blog posts planned out, so hopefully I'll get around to writing those! They'll be a mixture of stuff, nothing as technical or in-depth as my CSC1028 posts though (yet) - more like my FTL one, either in theme or rambliness.

Finally, I'll be keeping a log of changes to the site at [/changelog](/changelog) - I like looking back on how stuff like a personal site can change over time!
