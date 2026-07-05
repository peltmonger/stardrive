# ⚡ Changelog (without patches)

## Version 1

### 1.1

- Fixed: On-demand (SSR) rendered pages 404'd in production on Cloudflare. Added the `assets_navigation_has_no_effect` compatibility flag to `wrangler.jsonc` so navigation requests fall through to the Worker instead of being short-circuited to the static `404.html`. Documented the requirement in `README.md` and `.ai/CONFIG_GUIDE.md`.

### 1.0

Initial release

## General note

Mind that this only lists the most important changes. For a detailed overview, you can always compare the versions on GitHub directly, seeing every single line that changed
.
