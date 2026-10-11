import type { APIRoute } from 'astro'
import { llmsFull } from '../seo'
import { llmsPosts } from '../llms-posts'

// The whole site as Markdown (landing, about page, blog posts), English then Spanish.
export const GET: APIRoute = async ({ site }) =>
  new Response(llmsFull(site!, await llmsPosts(site!)), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
