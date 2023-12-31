import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	type: "content",
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),

			noHeader: z.boolean().optional(),

			published: z.date().optional(),
			updated: z.date().optional(),

			previewImage: image().optional(),
			tags: z.array(z.string()).optional(),
		}),
});

export const collections = { blog };
