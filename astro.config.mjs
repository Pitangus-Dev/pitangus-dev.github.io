// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import { loadEnv } from 'vite'
import securityHeaders from './integrations/security-headers.mjs'
import structuredData from './integrations/structured-data.mjs'

const env = loadEnv('production', '.', '')

// Where it's published (Cloudflare Workers static assets, wrangler.jsonc, at pitangus.dev; its security headers come from the security-headers
// integration). Both can be overridden from the environment, e.g. to serve it under a path.
export default defineConfig({
  site: env.SITE_URL ?? 'https://pitangus.dev',
  base: env.BASE_PATH ?? '/',
  output: 'static',
  integrations: [structuredData(), securityHeaders()],
  trailingSlash: 'ignore',
  // The stylesheets are small: inlined, the first paint doesn't wait for three more requests.
  build: { inlineStylesheets: 'always' },
  // The blog's code blocks are commands, set in the page's own colours (styles/instrument.css): no highlighter theme.
  markdown: { syntaxHighlight: false },
  i18n: { locales: ['en', 'es'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } },
  // Self-hosted, subset and preloaded at build time: no request to Google from the visitor's browser. Latin is enough
  // for both languages (Spanish's accents, ñ, ¿ and ¡ are all in it).
  fonts: [
    { provider: fontProviders.google(), name: 'Instrument Serif', cssVariable: '--font-display', weights: [400], styles: ['normal', 'italic'],
      subsets: ['latin'], fallbacks: ['Georgia', 'serif'] },
    { provider: fontProviders.google(), name: 'Instrument Sans', cssVariable: '--font-body', weights: ['400 700'], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
    // The pencil notes are decoration: until Caveat arrives they stay blank rather than show a cursive stand-in.
    { provider: fontProviders.google(), name: 'Caveat', cssVariable: '--font-hand', weights: [400], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['cursive'], display: 'block' },
    { provider: fontProviders.google(), name: 'JetBrains Mono', cssVariable: '--font-mono', weights: [400, 600], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['ui-monospace', 'monospace'] },
    // The blog and the about page speak like the product (the identity manual's instrument register): IBM Plex.
    { provider: fontProviders.google(), name: 'IBM Plex Sans', cssVariable: '--font-plex', weights: [400, 600], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'] },
    { provider: fontProviders.google(), name: 'IBM Plex Mono', cssVariable: '--font-plex-mono', weights: [400], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'] },
  ],
})
