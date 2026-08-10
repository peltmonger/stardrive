import type { APIRoute } from 'astro';
import { themeConfig } from '~/theme.config';

/**
 * Dynamic events sitemap - SSR endpoint that fetches event URLs from the Add to Calendar PRO API and returns them as a sitemap XML document.
 *
 * When `pullFromAddToCalendarPro` is disabled, returns an empty sitemap.
 */

// ---------------------------------------------------------------------------
// Minimal self-contained API helpers (mirrors event-bridge.ts internals, but
// without the `astro:content` dependency so this works at runtime with SSR).
// ---------------------------------------------------------------------------

const API_BASE = 'https://api.add-to-calendar-pro.com/v1';

interface ApiEventDate {
  startDate: string;
  endDate?: string | null;
}

interface ApiListEvent {
  prokey: string;
  dates?: ApiEventDate[];
}

const getApiKey = (): string => {
  const key = import.meta.env.ADD_TO_CALENDAR_PRO_API_KEY || process.env.ADD_TO_CALENDAR_PRO_API_KEY;
  if (!key) {
    throw new Error('events.dynamicEvents.pullFromAddToCalendarPro is enabled but ADD_TO_CALENDAR_PRO_API_KEY is not set.');
  }
  return key;
};

const buildAllQuery = (): string => {
  const params = new URLSearchParams();
  params.set('dates', 'true');
  const filterBy = themeConfig.events?.dynamicEvents?.filterBy;
  if (filterBy?.from) params.set('from', filterBy.from);
  if (filterBy?.to) params.set('to', filterBy.to);
  if (filterBy?.group) params.set('group', filterBy.group);
  return `?${params.toString()}`;
};

const dateSlug = (prokey: string, index: number, total: number): string => (total > 1 ? `${prokey}-${index}` : prokey);

const usesDynamicEvents = (): boolean => Boolean(themeConfig.events?.dynamicEvents?.pullFromAddToCalendarPro);

// ---------------------------------------------------------------------------
// Sitemap XML generation
// ---------------------------------------------------------------------------

const buildSitemapXml = (urls: Array<{ loc: string; lastmod?: string }>): string =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const escapeXml = (str: string): string => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  if (!usesDynamicEvents()) {
    return new Response(buildSitemapXml([]), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  const site = themeConfig.site.replace(/\/+$/, '');
  const { defaultLocale, locales } = themeConfig.i18n;

  let events: ApiListEvent[];
  try {
    const response = await fetch(`${API_BASE}/event/all${buildAllQuery()}`, {
      headers: { Authorization: getApiKey() },
    });
    if (!response.ok) {
      return new Response(buildSitemapXml([]), {
        status: 502,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      });
    }
    events = (await response.json()) as ApiListEvent[];
  } catch {
    return new Response(buildSitemapXml([]), {
      status: 502,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  if (!Array.isArray(events)) {
    return new Response(buildSitemapXml([]), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  const urls: Array<{ loc: string; lastmod?: string }> = [];
  for (const event of events) {
    const dates = event.dates ?? [];
    for (let i = 0; i < dates.length; i++) {
      const slug = dateSlug(event.prokey, i, dates.length);
      for (const locale of locales) {
        const prefix = locale === defaultLocale ? '' : `/${locale}`;
        urls.push({ loc: `${site}${prefix}/events/detail/${slug}` });
      }
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  return new Response(buildSitemapXml(unique), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
