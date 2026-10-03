import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cyanotype from './src/styles/shiki-cyanotype.mjs';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';
import { remarkSidenotes } from './src/lib/remark-sidenotes.mjs';

export default defineConfig({
  site: 'https://dhrumkit.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkSidenotes],
    shikiConfig: { theme: cyanotype, wrap: false },
  },
});
