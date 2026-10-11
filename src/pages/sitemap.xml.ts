import type { APIRoute } from 'astro'
import { ROUTES } from '../paths'
import { modified, posts, postPath } from '../blog'
import { absolute } from '../seo-pages'

// Every indexable page, each with its other language (x-default: English) when it exists. /og/* and the 404 stay out.
// lastmod: a post's own date (updated, else published); the other pages change only when the site is rebuilt and
// published, so the build date.
export const GET: APIRoute = async ({ site }) => {
  const built = new Date().toISOString().slice(0, 10)
  const pairs: { en?: string; es?: string; lastmod: string }[] =
    (['home', 'about', 'blog', 'subscribe'] as const).map(page => ({ en: ROUTES.en[page], es: ROUTES.es[page], lastmod: built }))
  const all = await posts()
  const keys = [...new Set(all.map(post => post.data.translationKey))]
  for (const key of keys) {
    const group = all.filter(post => post.data.translationKey === key)
    const en = group.find(post => post.data.lang === 'en')
    const es = group.find(post => post.data.lang === 'es')
    const latest = Math.max(...group.map(post => modified(post).getTime()))
    pairs.push({ en: en && postPath(en), es: es && postPath(es), lastmod: new Date(latest).toISOString().slice(0, 10) })
  }
  const urls = pairs.flatMap(({ en, es, lastmod }) => {
    const alternates = [en && ['en', en], es && ['es', es], en && ['x-default', en]].filter(Boolean) as [string, string][]
    const links = alternates.map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${absolute(path, site!)}"/>`).join('\n')
    return ([en, es].filter(Boolean) as string[]).map(path => `  <url>\n    <loc>${absolute(path, site!)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${links}\n  </url>`)
  }).join('\n')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  )
}
