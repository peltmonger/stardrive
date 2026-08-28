---
publishDate: 2026-06-03
draft: false
featured: true
llmsTxt: true
title: 'Build kicking websites with Astro and AI'
excerpt: 'We made thise boilerplate in an AI friendly way, so your Agent immediately knows how to work with it. Security included.'
image:
  file: '@images/content/articles/ai.jpg'
  alt: 'An astronaut meeting AI in space'
tags: ['astro', 'llm', 'claude', 'codex', 'copilot', 'open-code', 'pi']
categories: ['web-development', 'ai', 'productivity']
---

Here's a confession: most of this boilerplate was built with AI sitting right next to us. 🤩

Not as a gimmick - as a real workflow. And the reason it worked so well is that we designed Stardrive to be friendly to LLMs from the very first commit.

Let me explain what that means - and how you can use it to build kicking websites in record time.

## 💔 The problem with "AI-ready" projects

You've probably tried it. You open a repo, fire up your favorite AI coding agent (Copilot, Claude, Codex, Cursor - pick your poison), and ask it to "add a blog page."

What happens next is usually a mess.

The agent guesses at conventions. It invents a folder structure. It duplicates logic that already exists. It misses the i18n setup. It hardcodes strings that should be in translation files. And you spend the next hour cleaning up after it.

The problem isn't the AI. The problem is that most projects don't _tell_ the AI how they work.

And it gets worse. When you start from a blank repo, the AI isn't just missing instructions - it's missing the entire harness. There's no routing convention to follow, so it invents one. There's no i18n system, so it hardcodes strings. There's no security boundary, so it puts secrets where it shouldn't. There's no accessibility pattern, so it skips ARIA labels. Every one of those gaps becomes a bad architectural decision that you get to live with (and refactor) later.

The AI isn't lazy or dumb. It's just operating without guardrails. And building those guardrails _while_ the AI is already generating code is a nightmare - you're chasing a moving target. 😓

## 🩹 What Stardrive does differently

We took a different approach. Stardrive ships with explicit instructions for any LLM that touches it.

At the root, you'll find:

- `AGENTS.md` - the entry point. It tells the agent which mode it's in (boilerplate maintenance vs. building a project), where to find setup guides, and which conventions to follow.
- `STARDRIVE_AGENT_MODE.md` - a single keyword that switches the agent's behavior.
- `.ai/SETUP.md`, `.ai/CONFIG_GUIDE.md`, `.ai/PLAN.md` - a guided onboarding flow that builds a living checklist for your project.
- `CLAUDE.md` and `.github/copilot-instructions.md` - so different agents all start from the same context.

On top of that, the codebase itself follows consistent patterns: components are coarse and well-named, i18n strings live in predictable places, styling conventions are documented, and there's a clear decision tree for when to use plain HTML, VanillaJS, SolidJS, or something heavier.

The result? When you point an agent at Stardrive, it _immediately knows what to do_. No guessing. No babysitting.

But here's the bigger win: all the hard-wiring is already done. The routing, the i18n, the security boundaries, the accessibility patterns, the SEO plumbing, the caching strategy, the component conventions - it's all in place before the AI writes a single line. The guardrails aren't something you build alongside the AI. They're already there, baked into the foundation.

That's the real difference. When you start from scratch, you and the AI spend most of your time _building the harness_ - arguing about structure, fixing architectural mistakes, retro-fitting conventions onto code that was already generated. With Stardrive, that phase simply doesn't exist. The harness is done. So you and the AI get to focus on the fun part: actual features. 🚀

## 🛠️ How to actually use it

Here's a typical workflow:

1. **Create and configure your project.** Run `npm create stardrive@latest`. The setup flow creates the project and prepares it for your agent, which then walks you through the remaining configuration, asks the right questions, and writes a `PLAN.md`.
2. **Ask for features.** "Add a pricing page." "Translate the about page to Italian." "Wire up a newsletter form." The agent follows the conventions and produces code that fits.
3. **Review and ship.** Run `npm run check` to lint and type-check. Preview locally. Deploy.

That's it. The boilerplate handles routing, i18n, SEO, accessibility, structured data, caching - all the stuff that usually eats your time. You focus on the actual content and features.

## 🔒 Security included

One thing we care about a lot: AI-generated code can introduce security issues if you're not careful. Stardrive mitigates this by:

- Keeping secrets out of the frontend (Astro is a frontend framework - sensitive work belongs in a real backend).
- Shipping sensible security headers and CSP-friendly defaults.
- Providing clear boundaries for what should and shouldn't live in this repo.

The agent is told, in plain language, where those boundaries are. So it's much less likely to do something silly.

## 🚀 The takeaway

Building a website with AI doesn't have to mean "hope the agent doesn't break things." With the right foundation, it's a genuinely fast, pleasant workflow.

Stardrive is that foundation. Run `npm create stardrive@latest`, point your agent at the new project, and go build something kicking. 🎉
