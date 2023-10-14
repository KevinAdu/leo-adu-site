import { defineCollection, z } from 'astro:content';

const photoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    photo: z.string(),
    caption: z.string(),
    'publish-date': z.date(),
    age: z.string(),
    tags: z.array(z.string()).optional(),
  })
});

export const collections = {
  'photos': photoCollection
};