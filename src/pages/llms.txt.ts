import type { APIRoute } from 'astro'
import { llmsIndex } from '../seo'
import { llmsPosts } from '../llms-posts'

// llmstxt.org: a short Markdown map of the site for language models, generated from the pages' own words.
export const GET: APIRoute = async ({ site }) =>
  new Response(llmsIndex(site!, await llmsPosts(site!)), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
