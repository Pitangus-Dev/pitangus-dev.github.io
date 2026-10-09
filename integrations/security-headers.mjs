// Security headers for Cloudflare (dist/_headers, read by Workers static assets and Pages alike), written once the build is done. The CSP allows each inline
// script by its SHA-256, so it stays strict (no 'unsafe-inline' for scripts) and never needs editing by hand when one of
// them changes. Styles keep 'unsafe-inline': the pages use style attributes, which hashes cannot cover.
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

async function* pages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* pages(path)
    else if (entry.name.endsWith('.html')) yield path
  }
}

export default function securityHeaders() {
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir)
        const hashes = new Set()
        for await (const page of pages(root)) {
          const html = await readFile(page, 'utf8')
          for (const [, attributes = '', body] of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
            if (/\ssrc=/.test(attributes) || /type="application\/(ld\+)?json"/.test(attributes)) continue
            hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`)
          }
        }
        const csp = [
          "default-src 'self'",
          // Cloudflare Web Analytics injects its beacon at the edge and reports to cloudflareinsights.com.
          `script-src 'self' https://static.cloudflareinsights.com ${[...hashes].sort().join(' ')}`.trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self' https://cloudflareinsights.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          'upgrade-insecure-requests',
        ].join('; ')
        const headers = [
          '/*',
          `  Content-Security-Policy: ${csp}`,
          '  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
          '  X-Content-Type-Options: nosniff',
          '  X-Frame-Options: DENY',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  Permissions-Policy: accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
          '  Cross-Origin-Opener-Policy: same-origin',
          '',
          // Hashed file names: they never change, so browsers can keep them for a year.
          '/_astro/*',
          '  Cache-Control: public, max-age=31536000, immutable',
          '',
        ].join('\n')
        await writeFile(join(root, '_headers'), headers)
        logger.info(`_headers written (${hashes.size} inline script hash${hashes.size === 1 ? '' : 'es'} in the CSP)`)
      },
    },
  }
}
