---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Connect external data sources to your Astro Website'
excerpt: 'If you want your content to be edited outside of the codebase, you can configure Astro to pull data from those external sources. Learn how.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Astronauts connecting 2 data cables in space'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

xxx

> Mind that Astro creates static websites!
> When content changes, you would need to rebuild the whole site.
> This can be a little bit more dynamic with SSR (server-side-rendering), but this then comes with Caching challenges.

## Process

1. Setup the external CMS, making sure it comes with a proper API
2. Create some articles
3. Set up in Astro
4. Create Webhook to re-deploy the page on content changes (or purge the cache, if you are using SSR)
