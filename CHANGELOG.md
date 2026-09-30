# ⚡ Changelog (without patches)

## Version 1

### 1.6

- Upgraded the Astro and Cloudflare runtime chain, Add to Calendar Button, and the remaining project dependencies.
- Improved the scroll-controlled homepage video, reduced its media payload, and fixed parallax playback and theme-switching behavior.
- Made the calendar integration safe for server-side rendering and updated it for Add to Calendar Button 3.
- Added a styled XML sitemap, excluded error routes from generated sitemaps, and only include the dynamic-events sitemap when that feature is enabled.
- Expanded and translated the example showcase, refined demo content, and added Grok as an Ask AI option.
- Strengthened CI across the supported Node.js versions with formatting, linting, type, build, and generated-artifact checks.
- Removed the reveal-animation layer, restored the shared formatting baseline, and simplified the related documentation and markup.
- Added localized 404 pages and more robust static and on-demand error handling.

### 1.5

- Added public agent-skill metadata and discovery headers so AI agents can identify and use Stardrive's project guidance.
- Expanded the typed configuration and documentation for agent skills, dynamic events, and on-demand rendering.
- Improved SEO defaults, social preview images, Content Security Policy headers, footer alignment, and demo-page guidance.
- Refined the setup, trimming, favicon, and AI-agent instructions for safer and more predictable project initialization.

### 1.4

- Made internationalization work when optional content collections are empty and deferred on-demand collection access until runtime.
- Added stronger ESLint coverage and fixed issues found across navigation, docs, event, pricing, and metadata components.
- Added a post-build Wrangler configuration fix for Cloudflare deployments.
- Updated the hero video and tightened the setup, trimming, favicon, and AI guidance.

### 1.3

- Added configurable Ask AI links for ChatGPT, Claude, and Perplexity, including locale-aware prompts.
- Added the corresponding typed theme configuration and translated interface label.
- Refreshed social sharing, footer layout, dependencies, and repository naming.

### 1.2

- Added a comprehensive header guide covering variants, defaults, page-level overrides, and configuration options.
- Refined contact and newsletter forms, footer and navigation behavior, theme controls, and generic demo content.
- Fixed a WebMCP lifecycle leak and temporarily disabled client-side routing for more reliable page behavior.

### 1.1

- Hardened external data, event-bridge, structured-data, hreflang, and WebMCP handling with validation and sanitization.
- Optimized embedded YouTube videos and local-storage/theme behavior.
- Fixed the mobile references display and polished documentation, wording, metadata, and styles.

### 1.0

Initial release

## General note

Mind that this only lists the most important changes. For a detailed overview, you can always compare the versions on GitHub directly, seeing every single line that changed.
