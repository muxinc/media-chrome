import { defineCollection } from "astro:content"
import { z } from "zod"

export const collections = {
  authors: defineCollection({
    schema: z.object({
      image: z.string().optional(),
      name: z.string(),
      title: z.string().optional(),
      twitter: z.string().optional(),
      mastodon: z.string().optional(),
    }),
  }),
  blogroll: defineCollection({
    schema: z.object({
      title: z.string(),
      url: z.string().url(),
      authors: z.array(z.string()),
      date: z
        .string()
        .or(z.date())
        .or(z.number())
        .optional()
        .transform((val: string | number | Date) => {
          if (typeof val === 'number') return new Date(val, 0);
          return new Date(val);
        }),
      location: z.string(),
    }),
  }),
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
