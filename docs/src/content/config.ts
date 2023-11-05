import { defineCollection } from "astro:content"
import { z } from "zod"

export const collections = {
	showcase: defineCollection({
		schema: ({ image }) => z.object({
			title: z.string().min(1),
      byline: z.string(),
			image: image(),
			url: z.string().url(),
			featured: z.number().min(1).optional(),
			highlight: z.boolean().default(false),
		}),
	}),
};
