---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Externe Datenquellen mit deiner Astro-Website verbinden'
excerpt: 'Wenn deine Inhalte außerhalb des Codes bearbeitet werden sollen, kannst du Astro so konfigurieren, dass Daten aus externen Quellen geladen werden. So geht es.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Astronauten verbinden im All zwei Datenkabel'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

xxx

> Beachte, dass Astro statische Websites erzeugt!
> Wenn sich Inhalte ändern, muss die gesamte Seite neu gebaut werden.
> Mit SSR (Server-Side-Rendering) lässt sich das etwas dynamischer gestalten, allerdings kommen dann Caching-Herausforderungen hinzu.

## Vorgehen

1. Externes CMS einrichten und sicherstellen, dass es eine ordentliche API bietet
2. Einige Artikel anlegen
3. In Astro einbinden
4. Webhook erstellen, um die Seite bei Inhaltsänderungen neu zu deployen (oder den Cache zu leeren, wenn du SSR nutzt)
