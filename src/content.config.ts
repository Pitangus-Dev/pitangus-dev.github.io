// The blog: one Markdown file per post and language (src/content/blog/<lang>/<slug>.md). A post and its translation
// share `translationKey`, which links them (hreflang, the language link, the sitemap).
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(110),
    description: z.string().min(50).max(300),
    lang: z.enum(['en', 'es']),
    translationKey: z.string(),
    category: z.enum(['news', 'security']),
    tags: z.array(z.string()).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // Share picture: a file in public/ (1200 × 630). Without one, the site's own.
    image: z.object({ src: z.string(), alt: z.string(), width: z.number(), height: z.number() }).optional(),
  }),
})

export const collections = { blog }
