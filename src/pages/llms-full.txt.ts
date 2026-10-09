import type { APIRoute } from 'astro'
import { llmsFull } from '../seo'

// The whole landing as Markdown, English then Spanish, generated from i18n/content.ts.
export const GET: APIRoute = ({ site }) => new Response(llmsFull(site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
