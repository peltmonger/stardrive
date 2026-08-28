---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
featured: false
llmsTxt: true
slug: 'en/welcome'
title: 'Welcome to Astro Stardrive'
excerpt: 'We built a boilerplate on top of Astro to give you super powers when creating website. Completely free. Open Source. LLM friendly.'
image:
  file: '@images/content/articles/welcome-stardrive.jpg'
  alt: 'Astronauts waving to the camera'
tags: ['astro', 'js', 'ts', 'cloudflare', 'react', 'vue', 'svelte', 'solidjs', 'tailwind', 'directus', 'supabase', 'github']
categories: ['web-development', 'infrastructure', 'ai', 'it-security', 'productivity']
author:
  name: 'Jens Kürschner'
  url: 'https://jekuer.com'
tocDepth: 2
---

Hey there! 👋

So, you stumbled upon Astro Stardrive. Welcome!

If you ever started a new website from scratch, you probably know the pain. You pick a framework, configure the build, set up routing, fight with i18n, wire up a blog, a sitemap, an RSS feed, a cookie banner, a theme switcher, structured data, accessibility checks... and by the time you write your first real sentence, the weekend is gone. 😓

We have been there. Many times. And we got frustrated enough to do something about it.

## 🚀 The idea

Astro Stardrive is a boilerplate. Not a theme. Not a template. A real foundation - one that already made the boring (but critical) decisions for you.

The goal is simple: **create, configure, deploy.** In minutes, not weeks.

It ships with:

- A full Astro setup (static-first, with optional SSR on Cloudflare Workers).
- A blog, a docs section, an events page, a FAQ, a pricing page, and a contact form - all wired up.
- Built-in i18n (English, German, Spanish, French - extend as you like).
- A theme switcher that respects user preferences.
- Accessibility baked in (semantic HTML, ARIA labels, keyboard + touch support).
- SEO essentials: sitemaps, `robots.txt`, Open Graph, structured data, RSS.
- An LLM-friendly structure - more on that in the other articles.
- A WebMCP integration, so AI agents can actually use your site.
- Cloudflare-ready, with cache purging and headers configured.

And it is completely free and Open Source. 🤩

## 💡 Why a boilerplate?

A theme gives you looks. A boilerplate gives you a spine.

When you grab a random theme, you still have to figure out how everything fits together. Where do the strings live? How is routing handled? What about security headers? Most themes simply don't care - they just style whatever you throw at them.

Stardrive is different. It comes with strong opinions on structure, conventions, and tooling - so you can focus on your content and your features, not on plumbing. (We wrote a whole article about this - check [Boilerplate vs. Theme](/en/blog/boilerplate-vs-theme).)

## 🛠️ Built for humans - and for AI

Here is the fun part: we designed Stardrive to be friendly to LLMs from day one.

There is an `AGENTS.md` at the root, a `.ai/` folder with setup guides, a `PLAN.md` workflow, and consistent conventions everywhere. When you point your favorite AI coding agent (Copilot, Claude, Codex, whatever) at this repo, it immediately knows what to do. No babysitting. No "please read the README first" - it just works.

This means you can build real features by chatting with your agent. Want a new page? A new component? A different color scheme? Just ask. The boilerplate does the heavy lifting in the background.

## 🤝 Contributions and sponsors

Stardrive is a community project. We maintain it, but we can't do it alone.

If you find a bug, open an issue. If you fix one, send a PR. If you have an idea for a feature, let's talk. Every contribution counts - from typo fixes to new sections.

And if you are using Stardrive for a commercial project, consider sponsoring us. Maintaining a boilerplate is a lot of (mostly invisible) work - every bit of support helps us keep it fast, secure, and up to date. (Yes, doing all this work costs money - on our side 😐.)

## 🎉 What's next?

Have a look around. Read the other articles. Run `npm create stardrive@latest`, follow the setup guidance, and start your new project with `npm run dev`. Then build something awesome.

Welcome to Stardrive. Let's make the web a little less frustrating - together. 🚀
