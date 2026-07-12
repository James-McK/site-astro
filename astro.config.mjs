import { defineConfig, passthroughImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { compile } from "@catppuccin/vscode";

import htmlBeautifier from "astro-html-beautifier";

let vscodeCatppuccinMacchiato = compile("macchiato");
vscodeCatppuccinMacchiato.colors["editor.background"] = "#181926";

// https://astro.build/config
export default defineConfig({
	site: "https://mck.is",
	compressHTML: false,
	prefetch: {
		prefetchAll: true,
		prefetchStrategy: "viewport",
	},
	integrations: [sitemap(), htmlBeautifier()],
	build: {
		inlineStylesheets: "never",
	},
	markdown: {
		shikiConfig: {
			theme: vscodeCatppuccinMacchiato,
		},
	},
	image: {
		service: passthroughImageService(),
	},
});
