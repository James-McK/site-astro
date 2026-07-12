---
title: Pseudoscripting with <noscript>
description: Browsers hate this one weird trick!
published: 2024-12-13
updated: 2025-07-08
previewImage: ./noscript.avif
---

Update: a couple months later, this has been mostly outdated by the new [CSS' if()](https://developer.mozilla.org/en-US/docs/Web/CSS/if) function - I recommend you go read about it, CSS gets cooler and cooler every year :D

The new Container Style Query allows you to combine CSS that should only be applied when javascript is disabled with the rest of your CSS, in the same file/stylesheet.

<!-- can be in the head, or wherever you need it -->
<noscript>
	<style>
		:root {
			--noscript: true;
		}
	</style>
</noscript>

<!-- the stylesheet with the rest of your CSS -->
<style>
	.nojs {
		display: none;
	}

	@container style(--noscript: true) {
		.nojs {
			display: block;
		}

		.js {
			display: none;
		}
	}
</style>

<p class="js">You can see this paragraph because javascript is enabled!</p>

<p class="nojs">
	You can see this other paragraph because javascript is disabled!
</p>

```html
<!-- can be in the head, or wherever you need it -->
<noscript>
	<style>
		:root {
			--noscript: true;
		}
	</style>
</noscript>

<!-- the stylesheet with the rest of your CSS -->
<style>
	.nojs {
		display: none;
	}

	@container style(--noscript: true) {
		.nojs {
			display: block;
		}

		.js {
			display: none;
		}
	}
</style>

<p class="js">You can see this paragraph because javascript is enabled!</p>

<p class="nojs">You can see this other paragraph because javascript is disabled!</p>
```

I doubt there's any scenario where this is particularly useful, as [support for Container Style Queries](https://caniuse.com/css-container-queries-style) was only added to Chrome in 2023, Safari in 2024, and Firefox not at all at the time of writing. There's definitely a few people in the world who have the combination of an up to date browser and javascript disabled, but not many, and I don't know if any websites in the last decade actually make use of `<noscript>`.

Still, I think it's neat trick, I like staying up to date with what's supported in CSS, and I'm now using it on the main page of this site :D
