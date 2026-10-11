import type { LlmsPost } from './seo'
import { postPath, posts } from './blog'
import { absolute } from './seo-pages'

export const llmsPosts = async (site: URL): Promise<LlmsPost[]> => (await posts()).map(post => ({
  lang: post.data.lang, title: post.data.title, description: post.data.description, url: absolute(postPath(post), site),
  date: post.data.published.toISOString().slice(0, 10), body: post.body ?? '',
}))
