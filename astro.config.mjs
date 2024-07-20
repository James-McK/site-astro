import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { compile } from "@catppuccin/vscode";

let vscodeCatppuccinMacchiato = compile("macchiato");
vscodeCatppuccinMacchiato.colors["editor.background"] = "#181926";

// https://astro.build/config
export default defineConfig({
	site: "https://mck.is",
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: vscodeCatppuccinMacchiato,
		},
	},
	image: {
		service: {
			config: {
				limitInputPixels: false,
			},
		},
	},
});
