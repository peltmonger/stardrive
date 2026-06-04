---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Conecta fuentes de datos externas a tu sitio Astro'
excerpt: 'Si quieres que tu contenido se edite fuera del código, puedes configurar Astro para que obtenga los datos de esas fuentes externas. Aprende cómo hacerlo.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Astronautas conectando dos cables de datos en el espacio'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

xxx

> Ten en cuenta que Astro genera sitios estáticos.
> Cuando el contenido cambia, hay que reconstruir todo el sitio.
> Esto puede ser un poco más dinámico con SSR (renderizado en el servidor), pero introduce desafíos relacionados con la caché.

## Proceso

1. Configurar el CMS externo asegurándote de que ofrece una API adecuada
2. Crear algunos artículos
3. Configurarlo en Astro
4. Crear un webhook para volver a desplegar la página cuando cambie el contenido (o purgar la caché si usas SSR)
