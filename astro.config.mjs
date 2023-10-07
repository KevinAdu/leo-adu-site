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
        backend: {
          name: 'git-gateway',
          branch: 'master',
        },
        collections: [
          {
            name: 'photos',
            label: 'Photos',
            folder: 'src/pages/photos',
            slug: '{{year}}-{{month}}-{{day}}_{{age}}',
            summary: '{{title}} Age: {{age}} Author: {{commit_author}}',
            create: true,
            delete: true,
            fields: [
              { name: 'title', widget: 'string', label: 'Title' },
              { name: 'photo', widget: 'image', label: 'Photo' },
              { name: 'caption', widget: 'text', label: 'Caption' },
              { name: 'publish-date', widget: 'datetime', label: 'Publish Date' },
              { name: 'age', widget: 'select', label: 'Age', options: ageOptions, default: [ageOptions[0]] },
              { name: 'tags', widget: 'list', label: 'Tags' },
            ],
          },
        ],
      },
    }),
  ],
});