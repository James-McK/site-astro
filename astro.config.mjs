import { defineConfig } from "astro/config";
import vscodeCatppuccinMacchiato from "./macchiato.json";

import sitemap from "@astrojs/sitemap";

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
});
