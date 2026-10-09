// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import { loadEnv } from 'vite'
import securityHeaders from './integrations/security-headers.mjs'

const env = loadEnv('production', '.', '')

// Where it's published (Cloudflare Pages, at pitangus.dev; its security headers come from the security-headers
// integration). Both can be overridden from the environment, e.g. to serve it under a path.
export default defineConfig({
  site: env.SITE_URL ?? 'https://pitangus.dev',
  base: env.BASE_PATH ?? '/',
  output: 'static',
  integrations: [securityHeaders()],
  trailingSlash: 'ignore',
  i18n: { locales: ['en', 'es'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } },
  // Self-hosted, subset and preloaded at build time: no request to Google from the visitor's browser. Latin is enough
  // for both languages (Spanish's accents, ñ, ¿ and ¡ are all in it).
  fonts: [
    { provider: fontProviders.google(), name: 'Instrument Serif', cssVariable: '--font-display', weights: [400], styles: ['normal', 'italic'],
      subsets: ['latin'], fallbacks: ['Georgia', 'serif'] },
    { provider: fontProviders.google(), name: 'Instrument Sans', cssVariable: '--font-body', weights: ['400 700'], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
    { provider: fontProviders.google(), name: 'Caveat', cssVariable: '--font-hand', weights: ['400 700'], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['cursive'] },
    { provider: fontProviders.google(), name: 'JetBrains Mono', cssVariable: '--font-mono', weights: [400, 600], styles: ['normal'],
      subsets: ['latin'], fallbacks: ['ui-monospace', 'monospace'] },
  ],
})
