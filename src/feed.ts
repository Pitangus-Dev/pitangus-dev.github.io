// RSS 2.0 per language, written by hand: a few lines of XML don't need a dependency.
import type { Locale } from './i18n/content'
import { pages } from './i18n/pages'
import { ROUTES } from './paths'
import { modified, postPath, posts } from './blog'
import { absolute } from './seo-pages'

const xml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export async function feed(lang: Locale, site: URL) {
  const b = pages[lang].blog
  const list = await posts(lang)
  const self = absolute(ROUTES[lang].rss, site)
  const latest = list.length ? modified(list[0]) : new Date()
  const items = list.map(post => {
    const link = absolute(postPath(post), site)
    return [
      '    <item>',
      `      <title>${xml(post.data.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <pubDate>${post.data.published.toUTCString()}</pubDate>`,
      `      <description>${xml(post.data.description)}</description>`,
      `      <category>${xml(b.categories[post.data.category])}</category>`,
      ...post.data.tags.map(tag => `      <category>${xml(tag)}</category>`),
      '    </item>',
    ].join('\n')
  })
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xml(b.feedTitle)}</title>`,
    `    <link>${absolute(ROUTES[lang].blog, site)}</link>`,
    `    <description>${xml(b.feedDescription)}</description>`,
    `    <language>${lang}</language>`,
    `    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
