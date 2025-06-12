// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// 3. Define your collection(s)
const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }), };