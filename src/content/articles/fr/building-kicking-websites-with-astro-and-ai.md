---
publishDate: 2026-06-03
draft: false
featured: true
title: "Créez des sites web percutants avec Astro et l'IA"
excerpt: "Nous avons conçu ce boilerplate de manière compatible avec l'IA, afin que votre agent sache immédiatement comment l'utiliser. Sécurité incluse."
image:
  file: '@images/content/articles/ai.jpg'
  alt: "Un astronaute rencontrant l'IA dans l'espace"
tags: ['astro', 'llm', 'claude', 'codex', 'copilot', 'open-code', 'pi']
categories: ['web-development', 'ai', 'productivity']
---

Un aveu : la plus grande partie de ce boilerplate a été construite avec l'IA assise juste à côté de nous. 🤩

Pas comme un gadget - comme un vrai flux. Et si ça a si bien marché, c'est parce qu'on a conçu Stardrive pour qu'il soit amical avec les LLM dès le premier commit.

Je t'explique ce que ça veut dire - et comment tu peux t'en servir pour construire des sites percutants en un temps record.

## 💔 Le problème avec les projets "prêts pour l'IA"

Tu as probablement essayé. Tu ouvres un repo, tu lances ton agent de code IA préféré (Copilot, Claude, Codex, Cursor - choisis ton poison) et tu lui demandes d'"ajouter une page de blog".

Ce qui suit est généralement un bazar.

L'agent devine les conventions. Il invente une structure de dossiers. Il duplique de la logique qui existe déjà. Il rate le setup i18n. Il hardcode des chaînes qui devraient aller dans des fichiers de traduction. Et tu passes l'heure suivante à nettoyer derrière lui.

Le problème, ce n'est pas l'IA. Le problème, c'est que la plupart des projets ne _disent pas_ à l'IA comment ils fonctionnent.

Et ça empire. Quand tu pars d'un repo vide, l'IA ne manque pas seulement d'instructions - elle manque de tout le harnais. Pas de convention de routing, alors elle en invente une. Pas de système i18n, alors elle hardcode des chaînes. Pas de limite de sécurité, alors elle met des secrets là où il ne faut pas. Pas de pattern d'accessibilité, alors elle zappe les labels ARIA. Chacun de ces trous devient une mauvaise décision architecturale que tu vas trainer (et refactorer) plus tard.

L'IA n'est pas fainéante ni bête. Elle travaille juste sans guardrails. Et construire ces guardrails _pendant_ que l'IA génère déjà du code, c'est un cauchemar - tu cours après une cible mobile. 😓

## 🩹 Ce que Stardrive fait différemment

On a pris une autre approche. Stardrive embarque des instructions explicites pour tout LLM qui le touche.

À la racine, tu trouveras :

- `AGENTS.md` - le point d'entrée. Il dit à l'agent dans quel mode il est (maintenance du boilerplate vs. construction d'un projet), où trouver les guides de setup et quelles conventions suivre.
- `STARDRIVE_AGENT_MODE.md` - un seul mot-clé qui bascule le comportement de l'agent.
- `.ai/SETUP.md`, `.ai/CONFIG_GUIDE.md`, `.ai/PLAN.md` - un flux d'onboarding guidé qui construit une checklist vivante pour ton projet.
- `CLAUDE.md` et `.github/copilot-instructions.md` - pour que différents agents démarrent tous du même contexte.

Par-dessus, le codebase suit des motifs cohérents : les composants sont grossiers et bien nommés, les chaînes i18n vivent à des endroits prévisibles, les conventions de style sont documentées et il y a un arbre de décisions clair pour savoir quand utiliser du HTML brut, du VanillaJS, SolidJS ou quelque chose de plus lourd.

Le résultat ? Quand tu pointes un agent sur Stardrive, il _sait immédiatement quoi faire_. Pas de devinettes. Pas de babysitting.

Mais voici le plus gros gain : tout le câblage est déjà fait. Le routing, l'i18n, les limites de sécurité, les patterns d'accessibilité, la plomberie SEO, la stratégie de cache, les conventions de composants - tout est en place avant que l'IA écrive la moindre ligne. Les guardrails ne sont pas quelque chose que tu construis en même temps que l'IA. Ils sont déjà là, cuits dans la fondation.

C'est la vraie différence. Quand tu pars de zéro, toi et l'IA passez l'essentiel du temps à _construire le harnais_ - à débattre de structure, corriger des erreurs architecturales, rétrofitter des conventions sur du code déjà généré. Avec Stardrive, cette phase n'existe tout simplement pas. Le harnais est prêt. Du coup, toi et l'IA vous concentrez sur la partie fun : de vraies fonctionnalités. 🚀

## 🛠️ Comment l'utiliser vraiment

Voici un flux typique :

1. **Créer et configurer ton projet.** Lance `npm create stardrive@latest`. Le flux de setup crée le projet et le prépare pour ton agent, qui te guide ensuite dans le reste de la configuration, pose les bonnes questions et écrit un `PLAN.md`.
2. **Demander des fonctionnalités.** "Ajoute une page tarifs." "Traduis la page about en italien." "Branche un formulaire de newsletter." L'agent suit les conventions et produit du code qui colle.
3. **Revoir et publier.** Lance `npm run check` pour linter et vérifier les types. Prévisualise en local. Déploie.

C'est tout. Le boilerplate gère le routing, l'i18n, le SEO, l'accessibilité, les données structurées, le cache - tout ce qui mange ton temps en général. Tu te concentres sur le vrai contenu et les vraies fonctionnalités.

## 🔒 Sécurité incluse

Quelque chose qui nous tient à cœur : le code généré par IA peut introduire des problèmes de sécurité si on ne fait pas attention. Stardrive l'atténue :

- Pas de secrets côté frontend (Astro est un framework frontend - le travail sensible va dans un vrai backend).
- Des en-têtes de sécurité sensés et des defaults compatibles CSP.
- Des limites claires sur ce qui doit ou non vivre dans ce repo.

L'agent est informé, en mots clairs, où sont ces limites. Il est donc beaucoup moins susceptible de faire une bêtise.

## 🚀 La conclusion

Construire un site avec l'IA ne doit pas signifier "espérer que l'agent ne casse rien". Avec la bonne fondation, c'est un flux réellement rapide et agréable.

Stardrive est cette fondation. Lance `npm create stardrive@latest`, pointe ton agent vers le nouveau projet et va construire quelque chose de percutant. 🎉
