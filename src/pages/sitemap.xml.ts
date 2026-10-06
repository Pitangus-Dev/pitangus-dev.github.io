import type { APIRoute } from 'astro'
import { withBase } from '../paths'

// Only the two landings, each listing the other language (x-default: English). /og/* and the 404 stay out.
export const GET: APIRoute = ({ site }) => {
  const english = new URL(withBase('/'), site).href
  const spanish = new URL(withBase('/es/'), site).href
  const alternates = [['en', english], ['es', spanish], ['x-default', english]]
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`).join('\n')
  const urls = [english, spanish].map(loc => `  <url>\n    <loc>${loc}</loc>\n${alternates}\n  </url>`).join('\n')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  )
}
