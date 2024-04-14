import { defineConfig } from 'astro/config';

import vue from "@astrojs/vue";

const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;

const PROD_URL = 'https://layout-breakouts-builder.vercel.app/';
const DEFAULT_URL = isDev ? 'http://localhost:4321' : PROD_URL;

// https://astro.build/config
export default defineConfig({
  site: DEFAULT_URL,
  integrations: [vue()],
});