import { defineConfig } from 'astro/config';
import NetlifyCMS from 'astro-netlify-cms';
import netlify from "@astrojs/netlify/functions";

const ageOptions = [
  {label: 'Before Birth', value: 'beforeBirth'},
  {label: '1 Month Old', value: '1month'},
  {label: '2 Months Old', value: '2months'},
  {label: '3 Months Old', value: '3months'},
  {label: '4 Months Old', value: '4months'},
  {label: '5 Months Old', value: '5months'},
  {label: '6 Months Old', value: '6months'},
];

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
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
            summary: '{{year}}-{{month}}-{{day}}_{{age}} Author: {{commit_author}} Version: {{version}}',
            create: true,
            delete: true,
            fields: [
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