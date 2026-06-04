---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Connectez des sources de données externes à votre site Astro'
excerpt: 'Si vous souhaitez modifier vos contenus en dehors du code, vous pouvez configurer Astro pour qu''il récupère les données depuis ces sources externes. Voici comment.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Des astronautes connectant deux câbles de données dans l''espace'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

xxx

> Gardez à l''esprit qu''Astro génère des sites statiques !
> Lorsque le contenu change, le site entier doit être reconstruit.
> Cela peut être un peu plus dynamique avec le SSR (rendu côté serveur), mais cela introduit alors des défis liés au cache.

## Procédure

1. Mettre en place le CMS externe en s''assurant qu''il dispose d''une API correcte
2. Créer quelques articles
3. Configurer dans Astro
4. Créer un webhook pour redéployer la page lors des changements de contenu (ou purger le cache si vous utilisez le SSR)
