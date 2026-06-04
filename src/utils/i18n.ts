import { getRelativeLocaleUrl, getAbsoluteLocaleUrl } from 'astro:i18n';
import { themeConfig } from '~/theme.config';
import { getCollection, getEntry } from 'astro:content';
import type { CollectionKey, CollectionEntry } from 'astro:content';

const defaultLocale = themeConfig.i18n.defaultLocale;

// Dynamically assign to the translations object
const translations = {} as {
  [key: string]: {
    [key: string]: string | { [key: string]: string | { [key: string]: string } };
  };
};
for (const lang of themeConfig.i18n.locales) {
  translations[lang] = themeConfig.i18n.languageModules[lang as keyof typeof themeConfig.i18n.languageModules];
}

// function to be able to use t() in astro components
export function useTranslations(lang?: keyof typeof translations) {
  if (!lang || lang === '') lang = defaultLocale;
  return function t(key: keyof (typeof translations)[typeof defaultLocale]): string {
    const keyParts = key.toString().split('.');
    if (keyParts.length > 1) {
      const translation = translations[lang];
      if (typeof translation === 'object' && keyParts[0] in translation) {
        const firstLevel = translation[keyParts[0]];
        if (typeof firstLevel === 'object') {
          const cleanedSecond = keyParts[1].toLowerCase().replace(/\s/g, '-');
          if (keyParts.length > 2 && cleanedSecond in firstLevel) {
            const secondLevel = firstLevel[cleanedSecond];
            const cleanedThird = keyParts[2].toLowerCase().replace(/\s/g, '-');
            if (typeof secondLevel === 'object' && cleanedThird in secondLevel) {
              return secondLevel[cleanedThird].toString();
            }
          } else if (cleanedSecond in firstLevel) {
            const value = firstLevel[cleanedSecond];
            if (typeof value === 'string') return value;
          }
        }
      }
      // Fallback to default language
      const defaultFirst = translations[defaultLocale]?.[keyParts[0]];
      if (typeof defaultFirst === 'object') {
        const cleanedSecond = keyParts[1].toLowerCase().replace(/\s/g, '-');
        if (keyParts.length > 2 && cleanedSecond in defaultFirst) {
          const secondLevel = defaultFirst[cleanedSecond];
          const cleanedThird = keyParts[2].toLowerCase().replace(/\s/g, '-');
          if (typeof secondLevel === 'object' && cleanedThird in secondLevel) {
            return secondLevel[cleanedThird].toString();
          }
        } else if (cleanedSecond in defaultFirst) {
          const value = defaultFirst[cleanedSecond];
          if (typeof value === 'string') return value;
        }
      }
      return keyParts[keyParts.length - 1].toString();
    }
    const cleanedKey = keyParts[0].toLowerCase().replace(/\s/g, '-');
    return (translations[lang]?.[cleanedKey] ?? translations[defaultLocale]?.[cleanedKey] ?? keyParts[0].toString()).toString();
  };
}

// function to get the current path without the locale
export function getUrlWithoutLocale(url: URL, currentLang?: keyof typeof translations) {
  const path = url.pathname;
  if (!currentLang || currentLang === defaultLocale || path === '/') return path;
  return path === `/${currentLang}` || path === `/${currentLang}.html` ? '/' : path.replace(`/${currentLang}/`, '/');
}

// get path with locale, minding the dynamic nature of content
export async function getLocaleUrlWithContent(entryId: string, collection: CollectionKey, targetLang: keyof typeof translations, absolute?: boolean, absoluteBasePath?: string) {
  // get entry first
  const baseEntry = await getEntry(collection, entryId);
  // if baseEntry includes i18nSlug, we use that, otherwise we use the entryId
  const targetId = baseEntry?.collection !== 'faq_answers' && baseEntry?.data.i18nSlug?.[targetLang] ? baseEntry.data.i18nSlug[targetLang] : entryId;
  if (!targetLang) targetLang = defaultLocale;
  const contentEntries = [
    ...new Set(
      (
        (await getCollection(collection, ({ data }) => {
          return !data.draft;
        })) as CollectionEntry<typeof collection>[]
      )
        .map((entry) => (entry.id === targetLang + '/' + targetId.split('/').pop() ? targetId.split('/').pop() : null))
        .filter(Boolean),
    ),
  ];
  // fallback
  return getLocaleUrl((absoluteBasePath ? absoluteBasePath + '/' : '') + (contentEntries[0] ? contentEntries[0].split('/').pop() : targetId.split('/').pop()), targetLang, absolute);
}

// get path with locale
export function getLocaleUrl(slug: string, targetLang?: keyof typeof translations, absolute?: boolean) {
  if (!targetLang) targetLang = defaultLocale;
  if (slug === '/' && targetLang === defaultLocale) return absolute ? themeConfig.site + '/' : '/';
  const path = absolute ? getAbsoluteLocaleUrl(targetLang.toString(), slug) : getRelativeLocaleUrl(targetLang.toString(), slug);
  return path.replace(/\/$/, '');
}

// validating if the translated path exists
export async function checkTranslatedPath(currentLocale: keyof typeof translations, noi18n?: boolean, collection?: CollectionKey, entryId?: string) {
  const i18nSlug = await (async function () {
    if (!collection || !entryId || collection === 'faq_answers') return null;
    const baseEntry = await getEntry(collection, entryId);
    return baseEntry?.data.i18nSlug;
  })();
  const contentEntries =
    collection && entryId
      ? [
          ...new Set(
            (
              (await getCollection(collection, ({ data }) => {
                return !data.draft;
              })) as CollectionEntry<typeof collection>[]
            )
              .map((entry) => (entry.id.endsWith('/' + entryId.split('/').pop()) || (i18nSlug && i18nSlug[entry.id.split('/')[0]]) ? entry.id.split('/')[0] : null))
              .filter(Boolean),
          ),
        ]
      : [];
  return await Object.keys(translations).reduce(
    async (accPromise, languageCode) => {
      // unfortunately, at the moment only works with content collections
      // TODO: when there is a stable way to identify whether the target page is 404, adjust the logic here
      const acc = await accPromise;
      if (languageCode === currentLocale) {
        acc[languageCode] = true;
      } else if (noi18n) {
        acc[languageCode] = false;
      } else if (collection && entryId) {
        acc[languageCode] = contentEntries.includes(languageCode);
      } else {
        acc[languageCode] = true;
      }
      return acc;
    },
    Promise.resolve({} as Record<string, boolean>),
  );
}
