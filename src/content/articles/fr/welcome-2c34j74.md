---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
featured: false
slug: 'fr/welcome'
title: 'Bienvenue sur Astro Stardrive'
excerpt: 'Nous avons construit un boilerplate basé sur Astro pour vous donner des super-pouvoirs lors de la création de sites web. Entièrement gratuit. Open Source. Compatible LLM.'
image:
  file: '@images/content/articles/welcome-stardrive.jpg'
  alt: 'Des astronautes saluant la caméra'
tags: ['astro', 'js', 'ts', 'cloudflare', 'react', 'vue', 'svelte', 'solidjs', 'tailwind', 'directus', 'supabase', 'github']
categories: ['web-development', 'infrastructure', 'ai', 'it-security', 'productivity']
author:
  name: 'Jens Kürschner'
  url: 'https://jekuer.com'
tocDepth: 2
---

Salut ! 👋

Tu as débarqué sur Astro Stardrive. Bienvenue !

Si tu as déjà démarré un site web de zéro, tu connais la douleur. Tu choisis un framework, tu configures le build, tu montes le routing, tu te bats avec l'i18n, tu branches un blog, un sitemap, un flux RSS, une bannière de cookies, un sélecteur de thème, des données structurées, des vérifications d'accessibilité... et quand tu écris enfin ta première vraie phrase, le week-end est passé. 😓

On y était. Souvent. Et on s'est assez frustrés pour faire quelque chose.

## 🚀 L'idée

Astro Stardrive est un boilerplate. Pas un thème. Pas un template. Une vraie fondation - une qui a déjà pris les décisions ennuyeuses (mais critiques) pour toi.

L'objectif est simple : **créer, configurer, déployer.** En minutes, pas en semaines.

Il embarque :

- Un setup Astro complet (static-first, avec SSR optionnel sur Cloudflare Workers).
- Un blog, une section docs, une page événements, un FAQ, une page tarifs et un formulaire de contact - tout câblé.
- L'i18n intégré (anglais, allemand, espagnol, français - extensible à volonté).
- Un sélecteur de thème qui respecte les préférences de l'utilisateur.
- L'accessibilité dès le départ (HTML sémantique, labels ARIA, support clavier + tactile).
- Les bases SEO : sitemaps, `robots.txt`, Open Graph, données structurées, RSS.
- Une structure adaptée aux LLM - plus d'infos dans les autres articles.
- Une intégration WebMCP, pour que les agents IA puissent réellement utiliser ton site.
- Prêt pour Cloudflare, avec purge de cache et en-têtes configurés.

Et c'est entièrement gratuit et Open Source. 🤩

## 💡 Pourquoi un boilerplate ?

Un thème te donne du style. Un boilerplate te donne une colonne vertébrale.

Quand tu prends un thème au hasard, tu dois encore comprendre comment tout s'emboîte. Où vivent les chaînes ? Comment le routing est géré ? Et les en-têtes de sécurité ? La plupart des thèmes s'en fichent - ils habillent juste ce que tu leur donnes.

Stardrive est différent. Il arrive avec des opinions fortes sur la structure, les conventions et le tooling - pour que tu te concentres sur ton contenu et tes fonctionnalités, pas sur la plomberie. (On a écrit tout un article là-dessus - voir [Boilerplate vs. Theme](/fr/blog/boilerplate-vs-theme).)

## 🛠️ Conçu pour les humains - et pour l'IA

Voici la partie fun : on a conçu Stardrive pour qu'il soit amical avec les LLM dès le premier jour.

Il y a un `AGENTS.md` à la racine, un dossier `.ai/` avec des guides de setup, un flux de `PLAN.md` et des conventions cohérentes partout. Quand tu pointes ton agent de code IA préféré (Copilot, Claude, Codex, peu importe) sur ce repo, il sait immédiatement quoi faire. Pas de babysitting. Pas de "commence par lire le README" - ça marche, point.

Ça veut dire que tu peux construire de vraies fonctionnalités en discutant avec ton agent. Une nouvelle page ? Un nouveau composant ? Un autre schéma de couleurs ? Demande simplement. Le boilerplate fait le gros du travail en arrière-plan.

## 🤝 Contributions et sponsors

Stardrive est un projet communautaire. On le maintient, mais on ne peut pas le faire seuls.

Si tu trouves un bug, ouvre une issue. Si tu le corriges, envoie un PR. Si tu as une idée de fonctionnalité, parlons-en. Chaque contribution compte - des corrections de coquilles aux nouvelles sections.

Et si tu utilises Stardrive pour un projet commercial, pense à nous sponsoriser. Maintenir un boilerplate, c'est beaucoup de travail (surtout invisible) - chaque soutien nous aide à le garder rapide, sécurisé et à jour. (Oui, tout ce travail coûte de l'argent - de notre côté 😐.)

## 🎉 Et maintenant ?

Regarde autour. Lis les autres articles. Lance `npm create stardrive@latest`, suis les instructions de configuration et démarre ton nouveau projet avec `npm run dev`. Puis construis quelque chose de génial.

Bienvenue sur Stardrive. Rendons le web un peu moins frustrant - ensemble. 🚀

Explorez les différents articles pour découvrir les variations dans le frontmatter, qui illustrent les solutions de repli et les différentes options. Consultez `./src/content.config.ts` pour plus de détails sur les options disponibles.
