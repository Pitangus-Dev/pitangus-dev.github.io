// Checks the built pages' structured data: every JSON-LD block must parse, and every FAQ question and answer it declares
// must also be visible on the page (Google's rule, and ours: no markup without visible content). Fails the build if not.
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

async function* pages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* pages(path)
    else if (entry.name.endsWith('.html')) yield path
  }
}

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'" }
const visibleText = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '').replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, name) => entities[name])

export default function structuredData() {
  return {
    name: 'structured-data',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir)
        const problems = []
        let blocks = 0
        for await (const page of pages(root)) {
          const html = await readFile(page, 'utf8')
          const name = relative(root, page)
          for (const [, body] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
            blocks++
            let data
            try { data = JSON.parse(body) } catch (error) { problems.push(`${name}: JSON-LD doesn't parse (${error.message})`); continue }
            const text = visibleText(html)
            for (const node of data['@graph'] ?? [data]) {
              if (node['@type'] !== 'FAQPage') continue
              for (const { name: question, acceptedAnswer } of node.mainEntity) {
                if (!text.includes(question)) problems.push(`${name}: FAQ question not on the page: ${question}`)
                if (!text.includes(acceptedAnswer.text)) problems.push(`${name}: FAQ answer not on the page: ${question}`)
              }
            }
          }
        }
        if (problems.length) throw new Error(`Structured data:\n${problems.join('\n')}`)
        logger.info(`${blocks} JSON-LD block${blocks === 1 ? '' : 's'} parsed; FAQ answers all visible`)
      },
    },
  }
}
