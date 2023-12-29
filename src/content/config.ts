import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),

		published: z.date(),
		updated: z.date().optional(),

		previewImage: image().optional(),
		tags: z.string().optional(),
	}),
});

export const collections = { blog };
