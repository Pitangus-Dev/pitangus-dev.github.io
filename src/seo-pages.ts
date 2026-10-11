// Structured data of the blog and the about page. The nodes point at the landing's own (the publisher and the site,
// seo.ts) by @id, so search engines and assistants read one graph for the whole site.
import { BRAND, ORG, REPO, STEWARD } from './i18n/content'
import { withBase } from './paths'

export const absolute = (path: string, site: URL) => new URL(withBase(path), site).href
export const ids = (site: URL) => {
  const root = absolute('/', site)
  return { org: `${root}#arodium`, website: `${root}#website`, software: `${root}#software` }
}

// The publisher and the site, repeated in full so each page stands on its own.
export const siteNodes = (site: URL, lang: string) => [
  { '@type': 'Organization', '@id': ids(site).org, name: STEWARD.name, url: STEWARD.url, logo: absolute('/logo.svg', site), sameAs: [ORG, REPO] },
  { '@type': 'WebSite', '@id': ids(site).website, url: absolute('/', site), name: BRAND, inLanguage: lang, publisher: { '@id': ids(site).org } },
]

export const breadcrumbs = (site: URL, page: string, items: [string, string][]) => ({
  '@type': 'BreadcrumbList', '@id': `${page}#breadcrumb`,
  itemListElement: items.map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: absolute(path, site) })),
})

// Reading time for the post's header, from the Markdown body: words over a steady reading pace.
export const readingMinutes = (body: string, lang: string) => {
  const words = body.replace(/```[\s\S]*?```/g, ' ').replace(/[#*_`>\[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length
  return { words, minutes: Math.max(1, Math.round(words / (lang === 'es' ? 200 : 220))) }
}
