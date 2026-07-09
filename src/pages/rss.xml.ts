import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection } from "astro:content";
import { compareByPublishDate } from "./blog.astro";

import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import type { AstroGlobal, ImageMetadata } from "astro";
import { getImage } from "astro:assets";
const markdownParser = new MarkdownIt();

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/**/*.{jpeg,jpg,png,gif,avif,webp,svg}", // add more image formats if needed
);

export async function GET(context: AstroGlobal) {
	const posts = (await getCollection("markdownPosts"))
		.sort((a, b) => compareByPublishDate(a, b))
		.filter((post) => post.data.published)
		.filter((post) => post.data.public);

	const feed: RSSFeedItem[] = [];

	for (const post of posts) {
		const body = markdownParser.render(post.body || "(empty post)");
		const html = htmlParser.parse(body);
		const images = html.querySelectorAll("img");

		for (const img of images) {
			const src = img.getAttribute("src")!;

			// Relative paths that are optimized by Astro build
			if (src.startsWith("/images")) {
				// images starting with `/images/` is the public dir
				img.setAttribute("src", context.site + src.replace("/", ""));
			} else {
				// remove prefix of `./`
				const prefixRemoved = src.replace("./", "");
				// create prefix absolute path from root dir
				const imagePathPrefix = `/src/content/markdownPosts/${post.id}/${prefixRemoved}`;

				// call the dynamic import and return the module
				const imagePath = await imagesGlob[imagePathPrefix]?.()?.then((res) => res.default);

				if (imagePath) {
					const optimizedImg = await getImage({ src: imagePath });
					// set the correct path to the optimized image
					img.setAttribute("src", context.site + optimizedImg.src.replace("/", ""));
				}
			}
		}

		feed.push({
			title: post.data.title,
			pubDate: post.data.published,
			description: post.data.description,
			link: `/${post.id}`,
			// sanitize the new html string with corrected image paths
			content: sanitizeHtml(html.toString(), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		});
	}

	return rss({
		title: "weird autumn's blog",
		description: "who up xml-ing they rss",
		site: context.site!,
		items: feed,
		customData: `<language>en-gb</language>`,
	});
}
