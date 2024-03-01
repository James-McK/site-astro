---
title: Prototyping and small projects are fun!
description: They're also a good excuse to try out new things
published: 2024-03-02
previewImage: ./locals.png
---

I recently had an idea for a project: I wonder if it's possible for me to display what music I'm currently listening to on my website?  
(Spoiler: it is! Although it might just say "Currently offline" depending on when you're reading this)

<p class="music-display-container">
	<music-display nowPlayingApi="https://music-player.mck.is/now-playing" websocketUrl="wss://music-player.mck.is/now-playing-ws">
	</music-display>

  <script src="https://music-player.mck.is/musicDisplayComponent.js"></script>
</p>

Why? I think it's fun showing off what music I like, and it sometimes gets friends talking about music!

![hey i know that song](./hey-i-know-that-song.png)

So I started coming up with some ideas for what I'd need to do. I know MusicBee (the music player I normally use) has some sort of plugin system, since it's already how I was sharing what I was listening to on Discord - presumably I should be able to do something similar, just sending the data to my website instead? So I'd also need some sort of basic API to receive the data, then some way to display it on my website. Sounds like a plan!

Thankfully the [MusicBee website](https://www.getmusicbee.com/help/api/) has at least some documentaion on how to use the plugin system, the requirements for it (targeting .NET Framework 4.0), and an interface for all the methods it supports.  
Mildly annoying that it's .NET Framework (which is the version that only runs on windows) as I usually use linux, but I can easily switch to windows for compiling and testing the plugin, it should still run fine through wine later on. (Also getting to use more C# was nice, I've been enjoying it a lot recently)

Some quick browsing through the provided `MusicBeeApiInterface` and DiscordBee's source code, I found the methods I'd need for getting info about the currently playing song, and how to received notifications when the song changes - it was all pretty nice to use! The only notable thing was it also provided the album art as a base64 encoded string, which I had no idea what I was doing with yet.

```csharp
var artist = _mbApiInterface.NowPlaying_GetFileTag(MetaDataType.Artist);
var title = _mbApiInterface.NowPlaying_GetFileTag(MetaDataType.TrackTitle);
var album = _mbApiInterface.NowPlaying_GetFileTag(MetaDataType.Album);

var durationMs = _mbApiInterface.NowPlaying_GetDuration();
var positionMs = _mbApiInterface.Player_GetPosition();

var playState = _mbApiInterface.Player_GetPlayState();
var albumArt = _mbApiInterface.NowPlaying_GetArtwork();

// ... wrap up into playingData object

using var client = new System.Net.WebClient();
client.UploadString("http://localhost:3000", "POST", JsonConvert.SerializeObject(playingData));
```

For the server, I decided to just quickly throw it together using [Bun](https://bun.sh), since I've found javascript to be perfect for this scale of project. (Bun over NodeJS just because I wanted to try out its `Bun.serve` API, this won't be under enough load for speed to make any difference) To test that the idea worked at all, I told it to just log anything it received.

```typescript
Bun.serve({
	port: 3000,
	async fetch(req) {
		const body = (await req.json()) as PlayingData;

		console.table({
			...body,
			playState: PlayState[body.playState], // number -> string
			albumArt: "base64 encoded", // way too long to log
		});

		const buffer = Buffer.from(body.albumArt, "base64");
		Bun.write("albumArt.jpg", buffer);

		return new Response();
	},
});
```

So pretty quickly, I had my intial proof of concept working:

<p>
	<video controls>
		<source src="/blog/initial-music-prototype.mp4"></source>
	</video>
</p>

Neat!

Now I need to come up with some way to display this on my website. There's a huge range of different ways I could do this (svelte, react, htmx, vue, angular, solid, etc, etc.), but I don't want to have to worry about porting this thing to another framework if (when) I decide to change my website's tech stack.

To just get started, I used some vanilla JS to fetch the data from the server, and update the DOM with it.

<p>
	<video controls>
		<source src="/blog/initial-music-web-ui.mp4"></source>
	</video>
</p>

However this initial solution was a bit too simple - polling the server every 10 milliseconds is more than a bit excessive, but I still want it to update quickly. I'd heard of websockets before but didn't know much about them - after a bit of reading (MDN is fantastic), they seemed pretty much perfect! I can just have the server send the data to the client whenever it changes, and the client can update the DOM then.

But this meant the progress indicator only updated when the song changed or I manually moved to a different part of the song. `setInterval` to position it would definitely have worked here, but I felt like it'd be more interesting to try to understand CSS animations a bit better. After quite a bit of fiddling around, I figured out that setting a negative `animation-delay` would allow me to position the marker at the currently correct position, and animate over time to the end of the song.

```js
seekBarPositionMarker.style.animation = `moveRight ${playingData.durationMs}ms linear -${currentPosition}ms forwards`;
```

Perfect! With a bit of extra work, the whole thing looks pretty good.

![movies for guys by Jane Remover](./movies-for-guys.png)

And then a bit more work after I realised it should probably look good when squished down on mobile too:

![locals (girls like us) by Underscores](./locals.png)

(CSS grids are really cool! I should use them more often)

---

As a side-note, I found a tiny odd difference between Firefox and Chromium. I was using an SVG for the pause button, and decided to use some css variables to define how rounded the corners should be (`rx="calc(var(--border-radius) / 2)"`).  
Firefox logs a warning saying `Unexpected value` but still renders it the way I intended:

![Firefox's pause button with rounded corners](./pause-firefox.png)

While Chromium logs an error and renders it with sharp corners:

![Chromium's pause button with sharp corners](./pause-chromium.png)

I have no idea which one is "correct" (or if there even is an answer to that), but I found it odd since they both support CSS variables for the `fill` without any issues.

---

I also needed to host this server I'd made somewhere - rather than tying myself to a specific cloud provider and potentially dealing with issues from that in the future, I decided to just host it on the cheapest Hetzner cloud instance. (I've been using their servers for a couple of years now an not had any issues yet, and their stuff is actually reasonably priced)

I also decided to use this as a chance to try out NixOS on a server, and use Caddy instead of Nginx for the reverse proxy. I honestly can't beleive how simple this was to set up compared to anything I've done with Nginx in the past, it was just a few lines in my `configuration.nix`:

```nix
services.caddy = {
	enable = true;
	email = "...";
	virtualHosts."music-player.mck.is" = {
		extraConfig = ''
			reverse_proxy localhost:3000
		'';
	};
};
```

(And then wondering why it wasn't working for a few minutes before realising I'd forgotten about DNS)

The final thing I wanted to do was to make it so I could easily add this to any page on my website, ideally without having to copy and paste a bunch of js and css around. I decided to use a web component for this - I'd used them a little before and even though I feel like their implementation could be quite a bit better, I still really love the idea of them.
This means all I need to do to add it to any page is:

```html
<music-display
	nowPlayingApi="https://music-player.mck.is/now-playing"
	websocketUrl="wss://music-player.mck.is/now-playing-ws">
</music-display>

<script src="https://music-player.mck.is/musicDisplayComponent.js"></script>
```

<style>
	music-display {
		display: flex;
	}

	.music-display-container {
		display: flex;
		justify-content: center;
	}
</style>

<p class="music-display-container">
	<music-display nowPlayingApi="https://music-player.mck.is/now-playing" websocketUrl="wss://music-player.mck.is/now-playing-ws">
	</music-display>

  <script src="https://music-player.mck.is/musicDisplayComponent.js"></script>
</p>

And we're done!

Both the [MusicBee plugin](https://github.com/James-McK/PostPublicMusicPlugin) and [server + web component](https://github.com/James-McK/PostPublicMusicReceiver) are open source, so feel free to take a look! You could even host it yourself, if you wanted to for some reason? (I'm not really sure why I did this, so I'm not sure why you would either)

I'm really happy with how this whole project turned out! It went extremely (and unusually) smoothly, I managed to learn quite a bit anyway, and had fun putting the whole thing together.
