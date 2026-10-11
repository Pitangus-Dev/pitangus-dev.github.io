import type { APIRoute } from 'astro'
import { withBase } from '../paths'

// Everyone may read the whole site, search engines and AI assistants alike: the more of them that can quote Pitangus
// accurately, the better. The AI crawlers are named only to say so explicitly; the rule is the same as for everyone.
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'meta-externalagent',
  'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai', 'Bytespider',
]

export const GET: APIRoute = ({ site }) => new Response(
  [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_CRAWLERS.map(agent => `User-agent: ${agent}`),
    'Allow: /',
    '',
    `Sitemap: ${new URL(withBase('/sitemap.xml'), site)}`,
    '',
  ].join('\n'),
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
)
