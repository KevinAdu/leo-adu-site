import { defineConfig } from 'astro/config';
import NetlifyCMS from 'astro-netlify-cms';
import netlify from "@astrojs/netlify/functions";

const ageOptions = [
  'Before Birth', 
  '1 Month Old', 
  '2 Months Old', 
  '3 Months Old', 
  '4 Months Old', 
  '5 Months Old', 
  '6 Months Old', 
];

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  image: {
    domains: ["astro.build"],
  },
  integrations: [
    NetlifyCMS({
      config: {
        i18n: {
          structure: 'multiple_folders',
          locales: ['ja', 'en']
        },
        backend: {
          name: 'git-gateway',
          branch: 'master',
        },
        collections: [
          {
            name: 'photos',
            label: 'Photos',
            folder: 'src/pages/photos',
            slug: '{{year}}-{{month}}-{{day}}_{{title}}',
            summary: '{{title}} - Age: {{age}} Author: {{commit_author}}',
            i18n: true,
            create: true,
            delete: true,
            fields: [
              { name: 'title', widget: 'string', label: 'Title', i18n: true },
              { name: 'photo', widget: 'image', label: 'Photo', i18n: 'duplicate' },
              { name: 'caption', widget: 'text', label: 'Caption', i18n: true },
              { name: 'publish-date', widget: 'datetime', label: 'Publish Date', i18n: 'duplicate' },
              { name: 'age', widget: 'select', label: 'Age', options: ageOptions, default: ageOptions[0], i18n: 'duplicate' },
              { name: 'tags', widget: 'list', label: 'Tags', i18n: true },
            ],
          },
        ],
      },
    }),
  ],
});