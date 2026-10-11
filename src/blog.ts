// The blog's posts, as the pages, the feeds, the sitemap and llms.txt read them: published only, newest first.
import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from './i18n/content'
import { ROUTES } from './paths'

export type Post = CollectionEntry<'blog'>
export const slugOf = (post: Post) => post.id.split('/').pop()!
export const postPath = (post: Post) => `${ROUTES[post.data.lang].blog}${slugOf(post)}/`
export const modified = (post: Post) => post.data.updated ?? post.data.published

export async function posts(lang?: Locale) {
  const all = await getCollection('blog', post => !post.data.draft && (!lang || post.data.lang === lang))
  return all.sort((a, b) => b.data.published.getTime() - a.data.published.getTime())
}

// The same post in the other language, if it was written.
export async function translations(post: Post) {
  const all = await posts()
  return Object.fromEntries(all.filter(other => other.data.translationKey === post.data.translationKey)
    .map(other => [other.data.lang, postPath(other)])) as Partial<Record<Locale, string>>
}

export const dateLabel = (date: Date, lang: Locale) =>
  new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date)
