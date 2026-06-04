#!/usr/bin/env node

// This script generates an `llms.txt` file (one per configured language) after
// the Astro build has finished. Unlike the previous version, it does NOT
// scrape the full body of every page or article. Instead it lists:
//   - the site headline and description (from the rendered home page)
//   - the available languages (linked to their localized home page)
//   - an optional intro quote (from `theme.config.ts -> llms.intro`)
//   - pages   : title + meta description + URL
//   - FAQ     : question + full markdown answer
//   - articles: title + excerpt + URL
//
// Inclusion is controlled via the `llms` block in `theme.config.ts`:
//   - excludePagesPattern, includePages (glob patterns / explicit URLs)
//   - addArticles, addFAQ ("none" | "all" | "selected")

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
// The Cloudflare adapter places static assets under dist/client/; fall back
// to dist/ for plain static builds.
const _distBase = path.join(rootDir, 'dist');
const distDir = fs.existsSync(path.join(_distBase, 'client')) ? path.join(_distBase, 'client') : _distBase;
const contentDir = path.join(rootDir, 'src', 'content');

console.log('🚀 Starting llms.txt generation...');

// ---------------------------------------------------------------------------
// theme.config.ts parsing (lightweight regex parser - good enough for our
// needs and avoids pulling in a TS compiler at build time)
// ---------------------------------------------------------------------------

let cachedConfig = null;

function loadThemeConfig() {
  if (cachedConfig) return cachedConfig;

  const config = {
    site: '',
    hostname: '',
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
      languages: {},
    },
    llms: {
      autoGeneration: false,
      intro: '',
      excludePagesPattern: [],
      includePages: [],
      addArticles: 'none',
      addFAQ: 'none',
    },
  };

  try {
    const themeConfigContent = fs.readFileSync(path.join(rootDir, 'theme.config.ts'), 'utf-8');

    // site URL
    const siteMatch = themeConfigContent.match(/site:\s*(?:import\.meta\.env\.[A-Z_]+\s*\|\|\s*)?['"]([^'"]+)['"]/);
    if (siteMatch) {
      config.site = siteMatch[1].replace(/\/+$/, '');
      try {
        config.hostname = new URL(config.site).hostname;
      } catch {
        /* ignore */
      }
    }

    // i18n block - grab a balanced-ish slice starting at `i18n: {`
    const i18nBlock = extractBlock(themeConfigContent, /i18n:\s*\{/);
    if (i18nBlock) {
      const defaultLocaleMatch = i18nBlock.match(/defaultLocale:\s*['"]([^'"]+)['"]/);
      if (defaultLocaleMatch) config.i18n.defaultLocale = defaultLocaleMatch[1];

      const localesMatch = i18nBlock.match(/locales:\s*\[([^\]]*)\]/);
      if (localesMatch) {
        config.i18n.locales = localesMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);
      }

      const languagesBlock = extractBlock(i18nBlock, /languages:\s*\{/);
      if (languagesBlock) {
        const entryRe = /([A-Za-z0-9_-]+)\s*:\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = entryRe.exec(languagesBlock)) !== null) {
          config.i18n.languages[m[1]] = m[2];
        }
      }
    }

    // llms block
    const llmsBlock = extractBlock(themeConfigContent, /llms:\s*\{/);
    if (llmsBlock) {
      const autoGenMatch = llmsBlock.match(/autoGeneration:\s*(true|false)/);
      if (autoGenMatch) config.llms.autoGeneration = autoGenMatch[1] === 'true';

      const introMatch = llmsBlock.match(/intro:\s*(['"`])([\s\S]*?)\1/);
      if (introMatch) config.llms.intro = introMatch[2];

      const excludeMatch = llmsBlock.match(/excludePagesPattern:\s*\[([\s\S]*?)\]/);
      if (excludeMatch) {
        config.llms.excludePagesPattern = excludeMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);
      }

      const includeMatch = llmsBlock.match(/includePages:\s*\[([\s\S]*?)\]/);
      if (includeMatch) {
        config.llms.includePages = includeMatch[1]
          .split(',')
          .map((s) => {
            const v = s.trim().replace(/['"]/g, '');
            return v && !v.startsWith('/') ? `/${v}` : v;
          })
          .filter(Boolean);
      }

      const addArticlesMatch = llmsBlock.match(/addArticles:\s*(?:LlmsContentInclusion\.([A-Za-z]+)|['"]([A-Za-z]+)['"])/);
      if (addArticlesMatch) {
        const v = (addArticlesMatch[1] || addArticlesMatch[2] || '').toLowerCase();
        if (['none', 'all', 'selected'].includes(v)) config.llms.addArticles = v;
      }

      const addFAQMatch = llmsBlock.match(/addFAQ:\s*(?:LlmsContentInclusion\.([A-Za-z]+)|['"]([A-Za-z]+)['"])/);
      if (addFAQMatch) {
        const v = (addFAQMatch[1] || addFAQMatch[2] || '').toLowerCase();
        if (['none', 'all', 'selected'].includes(v)) config.llms.addFAQ = v;
      }
    }
  } catch (error) {
    console.warn('Warning: Could not parse theme.config.ts:', error.message);
  }

  cachedConfig = config;
  return config;
}

/**
 * Extract a brace-balanced block starting after a match of `startRegex`.
 * Returns the inner contents of the outermost `{ ... }` block.
 */
function extractBlock(source, startRegex) {
  const match = source.match(startRegex);
  if (!match) return null;
  const openIdx = source.indexOf('{', match.index);
  if (openIdx === -1) return null;
  let depth = 0;
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(openIdx + 1, i);
    }
  }
  return null;
}

function getPrefixDefaultLocale() {
  for (const fileName of ['astro.config.ts', 'astro.config.mjs', 'astro.config.js']) {
    const p = path.join(rootDir, fileName);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf-8');
    const m = content.match(/prefixDefaultLocale:\s*(true|false)/);
    if (m) return m[1] === 'true';
  }
  return false;
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function getPageMetaFromFile(filePath) {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let title = '';
    const titleTag = doc.querySelector('title');
    if (titleTag) {
      // Use only the first segment of "Title | Site"
      title = titleTag.textContent.trim().split('|')[0].trim();
    }

    let description = '';
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (metaDesc) description = (metaDesc.getAttribute('content') || '').trim();

    let noindex = false;
    const robotsMetas = doc.querySelectorAll('meta[name="robots"]');
    for (const m of robotsMetas) {
      const content = (m.getAttribute('content') || '').toLowerCase();
      if (content.includes('noindex')) {
        noindex = true;
        break;
      }
    }

    return { title, description, noindex };
  } catch (error) {
    console.warn(`Warning: Could not read meta for ${filePath}:`, error.message);
    return { title: '', description: '', noindex: false };
  }
}

// ---------------------------------------------------------------------------
// URL / language helpers
// ---------------------------------------------------------------------------

function detectLanguageFromPath(urlPath, availableLocales, defaultLocale) {
  const match = urlPath.match(/^\/([a-z]{2})(?:\/|$)/);
  if (match && availableLocales.includes(match[1])) return match[1];
  return defaultLocale;
}

function localeHomeUrl(site, locale, defaultLocale, prefixDefaultLocale) {
  if (locale === defaultLocale && !prefixDefaultLocale) return `${site}/`;
  return `${site}/${locale}`;
}

/**
 * Convert a single glob pattern (subset: `*`, `**`) into a RegExp.
 */
function globToRegex(pattern) {
  let p = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  p = p.replace(/\*\*/g, '__DOUBLE_STAR__');
  p = p.replace(/\*/g, '[^/]*');
  p = p.replace(/__DOUBLE_STAR__/g, '.*');
  return new RegExp(`^${p}$`);
}

function matchesAnyPattern(urlPath, patterns) {
  if (!patterns || patterns.length === 0) return false;
  const variants = [urlPath, urlPath.endsWith('/') ? urlPath.slice(0, -1) : `${urlPath}/`];
  return patterns.some((pat) => {
    const re = globToRegex(pat);
    return variants.some((v) => re.test(v));
  });
}

// ---------------------------------------------------------------------------
// Page discovery (from /dist)
// ---------------------------------------------------------------------------

function getDistPages(config) {
  const pages = [];
  if (!fs.existsSync(distDir)) return pages;

  const { defaultLocale, locales } = config.i18n;

  function visit(dir, urlBase = '') {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (entry.startsWith('[') && entry.endsWith(']')) continue; // dynamic routes
        visit(fullPath, `${urlBase}/${entry}`);
        continue;
      }
      if (!entry.endsWith('.html')) continue;
      if (entry === '404.html') continue;

      let urlPath;
      if (entry === 'index.html') {
        urlPath = urlBase === '' ? '/' : `${urlBase}/`;
      } else {
        urlPath = `${urlBase}/${entry.replace(/\.html$/, '')}`;
      }

      pages.push({
        filePath: fullPath,
        urlPath,
        language: detectLanguageFromPath(urlPath, locales, defaultLocale),
      });
    }
  }

  visit(distDir);
  return pages;
}

function isUnderCollection(urlPath, segments) {
  // Strip leading locale segment if any
  const stripped = urlPath.replace(/^\/[a-z]{2}(?=\/)/, '');
  return segments.some((seg) => stripped === `/${seg}` || stripped.startsWith(`/${seg}/`));
}

// ---------------------------------------------------------------------------
// Collection discovery (articles + FAQ)
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!fmMatch) return { data: {}, body: content };

  const raw = fmMatch[1];
  const body = fmMatch[2];
  const data = {};

  // Simple line-based parser supporting `key: value` and `key: "value"`.
  // Multi-line / nested structures are ignored (not needed for our fields).
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (value === '') continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    data[m[1]] = value;
  }

  return { data, body };
}

function scanCollectionDir(collectionDir, defaultLocale) {
  // Returns: [{ locale, slug, data, body, filePath }]
  const items = [];
  if (!fs.existsSync(collectionDir)) return items;

  function visit(dir, locale = null) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry.startsWith('_')) continue;
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        // First level subdirs are treated as locale (matching Astro's glob
        // base + `{lang}/...` convention used elsewhere in this project).
        visit(fullPath, locale || entry);
      } else if (entry.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, body } = parseFrontmatter(raw);
        items.push({
          locale: locale || defaultLocale,
          slug: entry.replace(/\.md$/, ''),
          data,
          body: body.trim(),
          filePath: fullPath,
        });
      }
    }
  }

  visit(collectionDir);
  return items;
}

function articleUrlPath(item, defaultLocale, prefixDefaultLocale) {
  // Slug precedence: i18nSlug[locale] is not parseable by our simple
  // frontmatter parser, so we fall back to `slug` or the filename.
  const slug = (typeof item.data.slug === 'string' && item.data.slug) || item.slug;
  // If slug already contains the locale prefix (e.g. "de/foo"), strip it.
  const slugNoLocale = slug.replace(/^[a-z]{2}\//, '');
  const usePrefix = item.locale !== defaultLocale || prefixDefaultLocale;
  return usePrefix ? `/${item.locale}/blog/${slugNoLocale}` : `/blog/${slugNoLocale}`;
}

function selectCollectionItems(items, mode, locale, includePages, urlBuilder) {
  return items
    .filter((it) => it.locale === locale)
    .filter((it) => {
      const url = urlBuilder(it);
      if (includePages.includes(url)) return true;
      if (mode === 'all') return true;
      if (mode === 'selected') return it.data.llmsTxt === true;
      return false;
    });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function generateLLMFiles() {
  const config = loadThemeConfig();

  if (!config.llms.autoGeneration) {
    console.log('ℹ️  llms.autoGeneration is disabled in theme.config.ts. Skipping.');
    return;
  }

  const { site, hostname, i18n, llms } = config;
  const { defaultLocale, locales, languages } = i18n;
  const prefixDefaultLocale = getPrefixDefaultLocale();

  // Discover pages
  const distPages = getDistPages(config);
  console.log(`📄 Found ${distPages.length} HTML pages in /dist`);

  // Discover collections
  const articleItems = scanCollectionDir(path.join(contentDir, 'articles'), defaultLocale);
  const faqItems = scanCollectionDir(path.join(contentDir, 'faq-answers'), defaultLocale);
  console.log(`📚 Found ${articleItems.length} article(s) and ${faqItems.length} FAQ entry/entries`);

  // A single llms.txt is generated, using the default-locale content. The
  // available-languages list (below) lets an LLM point users to the right
  // localized URL when needed.
  const lang = defaultLocale;
  console.log(`\n🌐 Generating llms.txt (default locale: ${lang})`);

  const homePath = !prefixDefaultLocale ? '/' : `/${lang}/`;
  const homeFile = !prefixDefaultLocale ? path.join(distDir, 'index.html') : path.join(distDir, lang, 'index.html');
  const rootMeta = fs.existsSync(homeFile) ? getPageMetaFromFile(homeFile) : { title: '', description: '' };

  // ---- Header ----
  let out = '';
  const headline = rootMeta.title;
  out += `# ${headline}`;
  if (hostname) {
    if (headline) out += ' | ';
    out += `${hostname}`;
  }
  out += `\n\n`;
  out += `Last updated on: ${new Date().toISOString()}\n\n`;

  // ---- Intro quote ----
  if (llms.intro && llms.intro.trim()) {
    const quoted = llms.intro
      .trim()
      .split(/\r?\n/)
      .map((line) => `> ${line}`)
      .join('\n');
    out += `${quoted}\n\n`;
  }

  // ---- Languages ----
  out += `## Languages\n\n`;
  const defaultName = languages[defaultLocale] || defaultLocale;
  out += `Default: [${defaultName}](${localeHomeUrl(site, defaultLocale, defaultLocale, prefixDefaultLocale)})\n\n`;
  out += `Available:\n`;
  for (const code of locales) {
    const name = languages[code] || code;
    const url = localeHomeUrl(site, code, defaultLocale, prefixDefaultLocale);
    out += `- [${name}](${url})\n`;
  }
  out += `\n`;

  // ---- Pages ----
  const collectionSegments = ['blog', 'faq', 'faq-answers'];
  const langPages = distPages
    .filter((p) => p.language === lang)
    .filter((p) => {
      // Skip pages that belong to the article/FAQ collections - those are
      // handled separately below.
      if (isUnderCollection(p.urlPath, collectionSegments)) return false;

      const explicitlyIncluded = llms.includePages.includes(p.urlPath);
      if (explicitlyIncluded) return true;

      if (matchesAnyPattern(p.urlPath, llms.excludePagesPattern)) return false;

      const meta = getPageMetaFromFile(p.filePath);
      if (meta.noindex) return false;
      return true;
    })
    // Stable ordering: home first, then alphabetical
    .sort((a, b) => {
      if (a.urlPath === homePath) return -1;
      if (b.urlPath === homePath) return 1;
      return a.urlPath.localeCompare(b.urlPath);
    });

  if (langPages.length > 0) {
    out += `## Pages\n\n`;
    for (const p of langPages) {
      const meta = getPageMetaFromFile(p.filePath);
      const title = meta.title || p.urlPath;
      const url = `${site}${p.urlPath}`;
      out += `### ${title}\n`;
      if (meta.description) out += `${meta.description}\n`;
      out += `URL: ${url}\n\n`;
    }
  }

  // ---- FAQ ----
  const selectedFaq = selectCollectionItems(
    faqItems,
    llms.addFAQ,
    lang,
    llms.includePages,
    // FAQ entries don't get dedicated URLs in this template, so the
    // includePages override matches against a synthetic path.
    (it) => `/faq#${it.slug}`,
  );
  if (selectedFaq.length > 0) {
    out += `## FAQ\n\n`;
    for (const it of selectedFaq) {
      const question = it.data.question || it.slug;
      out += `### ${question}\n`;
      if (it.body) out += `${it.body}\n`;
      out += `\n`;
    }
  }

  // ---- Articles ----
  const selectedArticles = selectCollectionItems(articleItems, llms.addArticles, lang, llms.includePages, (it) => articleUrlPath(it, defaultLocale, prefixDefaultLocale));
  if (selectedArticles.length > 0) {
    out += `## Articles\n\n`;
    for (const it of selectedArticles) {
      const title = it.data.title || it.slug;
      const excerpt = it.data.excerpt || '';
      const url = `${site}${articleUrlPath(it, defaultLocale, prefixDefaultLocale)}`;
      out += `### ${title}\n`;
      if (excerpt) out += `${excerpt}\n`;
      out += `URL: ${url}\n\n`;
    }
  }

  const outPath = path.join(distDir, `llms.txt`);
  fs.writeFileSync(outPath, out, 'utf-8');
  console.log(`   ✅ Wrote ${path.basename(outPath)} (${(out.length / 1024).toFixed(1)}KB)`);

  console.log(`\n🎉 llms.txt generation complete.`);
}

generateLLMFiles().catch((error) => {
  console.error('❌ Error generating llms.txt:', error);
  process.exit(1);
});
