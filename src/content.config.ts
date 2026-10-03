import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One folder per post: src/content/posts/<slug>/index.mdx, with post-only figures beside it.
const posts = defineCollection({
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    series: z.string(),
    number: z.string(),
    date: z.coerce.date(),
    readingTime: z.string().optional(), // override; computed from the text otherwise
    author: z.string().default('Dhrumit'),
    sections: z.array(z.object({ id: z.string(), label: z.string() })).default([]), // override; built from ## headings otherwise
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
