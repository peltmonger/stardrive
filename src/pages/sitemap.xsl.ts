import type { APIRoute } from 'astro';
import { themeConfig } from '~/theme.config';

type Rgb = [number, number, number];

const parseHex = (value: string | undefined, fallback: string): Rgb => {
  const hex = (value || fallback).trim().replace(/^#/, '');
  const normalized = hex.length === 3 ? [...hex].map((character) => character + character).join('') : hex;
  const match = /^[\da-f]{6}$/i.exec(normalized);
  const color = match ? normalized : fallback.replace(/^#/, '');
  return [Number.parseInt(color.slice(0, 2), 16), Number.parseInt(color.slice(2, 4), 16), Number.parseInt(color.slice(4, 6), 16)];
};

const toHex = (color: Rgb): string => `#${color.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
const mix = (from: Rgb, to: Rgb, amount: number): Rgb => [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount, from[2] + (to[2] - from[2]) * amount];
const luminance = (color: Rgb): number => {
  const [red, green, blue] = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (first: Rgb, second: Rgb): number => {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
};
const contrastingText = (background: Rgb): Rgb => (contrast(background, [0, 0, 0]) >= contrast(background, [255, 255, 255]) ? [0, 0, 0] : [255, 255, 255]);
const ensureContrast = (color: Rgb, background: Rgb, minimum = 4.5): Rgb => {
  if (contrast(color, background) >= minimum) return color;
  const target = contrastingText(background);
  for (let step = 1; step <= 20; step += 1) {
    const candidate = mix(color, target, step / 20);
    if (contrast(candidate, background) >= minimum) return candidate;
  }
  return target;
};
const escapeXml = (value: string): string => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const background = parseHex(themeConfig.themeColor, '#0a0a0a');
const text = contrastingText(background);
const accent = ensureContrast(parseHex(themeConfig.primaryColor, '#0079dc'), background);
const textMuted = ensureContrast(mix(text, background, 0.45), background);
const palette = {
  accent: toHex(accent),
  background: toHex(background),
  elevated: toHex(mix(background, text, 0.06)),
  subtle: toHex(mix(background, text, 0.1)),
  border: toHex(mix(background, text, 0.18)),
  borderSubtle: toHex(mix(background, text, 0.12)),
  text: toHex(text),
  textMuted: toHex(textMuted),
};
const siteName = escapeXml(themeConfig.name || new URL(themeConfig.site).hostname);

const stylesheet = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>${siteName} XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          :root {
            --accent: ${palette.accent};
            --bg: ${palette.background};
            --bg-elevated: ${palette.elevated};
            --bg-subtle: ${palette.subtle};
            --border: ${palette.border};
            --border-subtle: ${palette.borderSubtle};
            --text: ${palette.text};
            --text-muted: ${palette.textMuted};
          }
          * { box-sizing: border-box; }
          body {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
            color: var(--text);
            background: var(--bg);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          a { color: inherit; transition: color 0.15s; }
          a:hover { color: var(--accent); }

          /* Main content */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem;
          }
          .header {
            margin-bottom: 1.25rem;
          }
          .header h1 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
            color: var(--text);
          }
          .header-meta {
            color: var(--text-muted);
            font-size: 12px;
          }
          .header-meta a {
            color: var(--text-muted);
            text-decoration: underline;
            text-decoration-color: var(--border);
            text-underline-offset: 2px;
          }
          .header-meta a:hover { color: var(--accent); text-decoration-color: var(--accent); }

          /* Table */
          .table-wrap {
            border: 1px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-elevated);
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            text-align: left;
            padding: 0.625rem 1rem;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            background: var(--bg-subtle);
            border-bottom: 1px solid var(--border);
          }
          td {
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--border-subtle);
            font-size: 12px;
            color: var(--text);
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: rgba(255,255,255,0.02); }
          td a {
            text-decoration: none;
            word-break: break-all;
            color: var(--text);
          }
          td a:hover { color: var(--accent); }
          .count {
            display: inline-block;
            min-width: 1.25rem;
            padding: 0.125rem 0.375rem;
            background: var(--bg-subtle);
            border-radius: 4px;
            text-align: center;
            font-size: 11px;
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
          }
          .count:empty::before { content: "0"; }

          /* Responsive */
          @media (max-width: 640px) {
            .container { padding: 1rem; }
            th, td { padding: 0.5rem 0.75rem; }
          }
          
        </style>
      </head>
      <body>
        
        <div class="container">
          <div class="header">
            <h1>${siteName}</h1>
            <div class="header-meta">
              
              <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
                <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps
              </xsl:if>
              <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
              </xsl:if>
            </div>
          </div>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width:70%">Sitemap</th>
                    <th style="width:30%">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <xsl:variable name="sitemapURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <tr>
                      <td>
                        <a href="{$sitemapURL}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:value-of
                          select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width:50%">URL</th>
<th style="width:25%">Images</th>
<th style="width:25%">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td>
                        <xsl:variable name="itemURL">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:variable>
                        <a href="{$itemURL}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                        
                      </td>
                      <td><span class="count"><xsl:value-of select="count(image:image)"/></span></td>
<td><span class="count"><xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/></span></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
        </div>
        
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

export const GET: APIRoute = () =>
  new Response(stylesheet, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
