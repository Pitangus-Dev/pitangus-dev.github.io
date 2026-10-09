import type { APIRoute } from 'astro'
import { llmsIndex } from '../seo'

// llmstxt.org: a short Markdown map of the site for language models, generated from the page's own words.
export const GET: APIRoute = ({ site }) => new Response(llmsIndex(site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
