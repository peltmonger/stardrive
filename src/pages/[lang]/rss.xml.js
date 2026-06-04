import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { useTranslations } from '@utils/i18n';
import { themeConfig } from '~/theme.config';

export function getStaticPaths() {
  return themeConfig.i18n.locales
    .filter((lang) => lang !== themeConfig.i18n.defaultLocale)
    .map((lang) => ({
      params: { lang: lang },
    }));
}

export async function GET(context) {
  const locale = context.params.lang;
  const t = useTranslations(locale);
  const articles = await getCollection('articles', ({ id, data }) => {
    // only show articles that are not drafts and mind locale
    return !data.draft && id.startsWith(locale + '/');
  });
  return rss({
    title: t('rss.title'),
    description: t('rss.description'),
    site: context.site + '/' + locale,
    trailingSlash: false,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.excerpt,
      customData: `<language>${article.id.split('/')[0]}</language>`,
      link: (article.id.split('/')[0] === themeConfig.i18n.defaultLocale ? '' : '/' + article.id.split('/')[0]) + `/blog/${article.id.split('/')[1]}/`,
    })),
  });
}
