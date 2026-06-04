import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { useTranslations } from '@utils/i18n';
import { themeConfig } from '~/theme.config';

const defaultLocale = themeConfig.i18n.defaultLocale;
const t = useTranslations(defaultLocale);

export async function GET(context) {
  const articles = await getCollection('articles', ({ id, data }) => {
    // only show articles that are not drafts and mind locale
    return !data.draft && id.startsWith(defaultLocale + '/');
  });
  return rss({
    title: t('rss.title'),
    description: t('rss.description'),
    site: context.site,
    trailingSlash: false,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.excerpt,
      customData: `<language>${article.id.split('/')[0]}</language>`,
      link: (article.id.split('/')[0] === defaultLocale ? '' : '/' + article.id.split('/')[0]) + `/blog/${article.id.split('/')[1]}/`,
    })),
  });
}
