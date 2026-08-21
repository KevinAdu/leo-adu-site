import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photoCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: z.object({
    title: z.string(),
    photo: z.string(),
    caption: z.string(),
    'publish-date': z.date(),
    tags: z.array(z.string()).optional(),
  })
});

export const collections = {
  'photos': photoCollection
};
