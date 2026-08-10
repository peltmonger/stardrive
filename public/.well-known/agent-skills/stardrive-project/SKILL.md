---
name: stardrive-project
description: Configure, customize, extend, and maintain websites built with the Astro Stardrive boilerplate. Use when creating a Stardrive project, completing its guided setup, changing its pages or components, or preserving Stardrive conventions while adding features.
---

# Stardrive Project

Use Stardrive's repository guidance as the source of truth. Keep changes simple, accessible, and close to Astro defaults.

## Start the right workflow

1. For a new website, create a project with `npm create stardrive@latest` unless the user already has a clone.
2. In an existing repository, read `AGENTS.md` before analyzing or editing anything.
3. Follow its bootstrap directive and the mode selected by `STARDRIVE_AGENT_MODE.md`:
   - `project`: build the user's website and follow `.ai/PLAN.md`; if the plan is absent, follow `.ai/SETUP.md`.
   - `boilerplate`: maintain Stardrive itself and follow `.ai/BOILERPLATE_MODE.md`.
4. Follow linked `.ai` guides in their stated order. Do not activate unrelated setup guides merely by reading them.

If the repository lacks Stardrive's guidance files, confirm that it is actually a Stardrive project before applying these conventions. Consult the [official repository](https://github.com/peltmonger/stardrive) and [documentation](https://astro-stardrive.com/docs) when current boilerplate behavior is needed.

## Implement changes

- Inspect `package.json`, `theme.config.ts`, and nearby files before choosing an approach.
- Prefer Astro and existing HTML. Use small vanilla JavaScript only when necessary; ask before adding a UI framework for complex interactivity.
- Keep one-off markup inline. Extract a component only for reuse, substantial self-contained complexity, or a clear reusable design primitive.
- Preserve the repository's existing i18n structure and styling conventions.
- Use SVG files as components or ordinary `img` elements, never through Astro's `Image` component.
- Keep secrets and sensitive backend logic out of frontend code. Use a real backend service when private processing is required.
- Preserve semantic HTML, keyboard and touch operation, labels, focus behavior, and sufficient contrast.
- Avoid speculative abstractions and unrelated cleanup.

When functionality appears to have been removed from the boilerplate, check `theme.config.ts` and the official repository before rebuilding it. Ask whether restoring Stardrive's original implementation is preferable.

## Validate and hand off

1. Run the narrowest relevant check while iterating.
2. Run `npm run check` before completion when the environment permits it.
3. Preserve unrelated user changes and report pre-existing failures separately.
4. Summarize changed behavior, affected files, validation results, and any deployment or configuration step the user must perform.
