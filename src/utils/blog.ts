import type { CollectionEntry } from 'astro:content';

export function sortArticleList<T extends CollectionEntry<'articles'>>(items: T[]): T[] {
  // sort by item.data.featured first and then by item.data.publishDate second descending
  const sortedItems = items.sort((a, b) => {
    if (a.data.featured && b.data.featured) return 0;
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    if (a.data.publishDate > b.data.publishDate) return -1;
    if (a.data.publishDate < b.data.publishDate) return 1;
    return 0;
  });
  return sortedItems;
}

export function getAdjacentArticles<T extends CollectionEntry<'articles'>>(index: number, articles: T[]): { prev: T | undefined; next: T | undefined } | null {
  if (articles.length <= 1) {
    return null;
  }
  const prev = articles[index - 1];
  const next = articles[index + 1];
  if (prev && next) {
    return { prev, next };
  }
  if (next && !prev) {
    return { prev: next, next: articles[index + 2] };
  }
  if (prev && !next) {
    return { prev: articles[index - 2], next: prev };
  }
  return { prev: undefined, next: articles[0] };
}
