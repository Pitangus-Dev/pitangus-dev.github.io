// What machines read about the landing: the structured data in each page's head (Base.astro) and the Markdown of
// /llms.txt and /llms-full.txt. All of it comes from i18n/content.ts, the same words the page shows: nothing here may
// say what the page doesn't.
import type { Content } from './i18n/content'
import { BRAND, CHANGELOG, DOCS, INSTALL, LICENSE, ORG, RELEASE, REPO, STEWARD, content } from './i18n/content'
import { ROUTES, withBase } from './paths'
import { pages } from './i18n/pages'

const home = (lang: Content['lang']) => withBase(lang === 'es' ? '/es/' : '/')
export const pageUrl = (t: Content, site: URL, hash = '') => new URL(`${home(t.lang)}${hash}`, site).href

// One graph per page: who makes it, the site, the software and the page itself, which is its FAQ. The FAQ items are the
// ones the page renders visibly (components/Faq.astro).
export function structuredData(t: Content, site: URL) {
  const root = new URL(withBase('/'), site).href
  const page = pageUrl(t, site)
  const image = new URL(withBase(`/og-${t.lang}.jpg`), site).href
  const org = `${root}#arodium`
  const website = `${root}#website`
  const software = `${root}#software`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': org, name: STEWARD.name, url: STEWARD.url, logo: new URL(withBase('/logo.svg'), site).href, sameAs: [ORG] },
      { '@type': 'WebSite', '@id': website, url: root, name: BRAND, inLanguage: t.lang, publisher: { '@id': org } },
      {
        '@type': 'SoftwareApplication', '@id': software, name: BRAND, url: root, description: t.meta.description,
        applicationCategory: 'SecurityApplication', operatingSystem: 'Linux (Docker)',
        softwareVersion: RELEASE.replace(/^v/, ''), softwareRequirements: t.seo.requirements,
        memoryRequirements: '4 GB', storageRequirements: '8 GB',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: LICENSE.url, isAccessibleForFree: true, inLanguage: ['en', 'es'],
        downloadUrl: `${REPO}/releases/tag/${RELEASE}`, installUrl: pageUrl(t, site, '#install'),
        featureList: t.seo.features, image, screenshot: image,
        sameAs: [REPO], publisher: { '@id': org },
      },
      {
        '@type': 'FAQPage', '@id': page, url: page, name: t.meta.title, description: t.meta.description, inLanguage: t.lang,
        isPartOf: { '@id': website }, about: { '@id': software },
        mainEntity: t.faq.items.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
      },
    ],
  }
}

// Inside a <script>, "</" would end it early: escape "<" (still valid JSON).
export const jsonForScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

// A blog post as /llms.txt and /llms-full.txt list it (built by pages/llms*.txt.ts from the content collection).
export interface LlmsPost { lang: Content['lang']; title: string; description: string; url: string; date: string; body: string }

// /llms.txt (llmstxt.org): what Pitangus is, then links to the page's sections, the other pages and the product's documents.
export function llmsIndex(site: URL, posts: LlmsPost[] = []) {
  const t = content.en
  const link = (label: string, href: string, note: string) => `- [${label}](${href}): ${note}`
  const sections: [string, string, string][] = [
    [t.specimens.kicker, 'specimens', t.specimens.title],
    [t.change.kicker, 'change', t.change.title],
    [t.ledger.kicker, 'ledger', t.ledger.title],
    [t.sources.kicker, 'sources', t.sources.title],
    [t.ticket.kicker, 'ticket', t.ticket.title],
    [t.yours.kicker, 'yours', t.yours.title],
    [t.install.kicker, 'install', t.install.title],
    [t.faq.kicker, 'faq', t.faq.title],
  ]
  return [
    `# ${BRAND}`,
    '',
    `> ${t.faq.items[0].a}`,
    '',
    `${t.hero.lead} ${t.yours.items.map(item => `${item.title}: ${item.body}`).join(' ')}`,
    '',
    `## ${t.seo.sections}`,
    '',
    ...sections.map(([label, id, title]) => link(label, pageUrl(t, site, `#${id}`), title)),
    '',
    `## ${t.seo.docs}`,
    '',
    link('Repository', REPO, 'source code, README and issues'),
    link('Documentation', DOCS, 'installation, deployment, features, security, CLI and integrations'),
    link('Quickstart', `${DOCS}quickstart/`, 'from zero to the first verified fix'),
    link('Features', `${DOCS}features/`, 'what each part does and why'),
    link('Security', `${DOCS}security/`, 'secrets, what leaves your machine, trade-offs'),
    link('Terminal and CI', `${DOCS}cli/`, 'pitangus scan, SARIF output, exit codes and the GitHub Action'),
    link('Changelog', CHANGELOG, 'notable changes in each release'),
    link('License', LICENSE.file, `${LICENSE.spdx}`),
    '',
    '## About and blog',
    '',
    link(pages.en.about.title, new URL(withBase(ROUTES.en.about), site).href, pages.en.about.description),
    link(pages.en.blog.title, new URL(withBase(ROUTES.en.blog), site).href, `${pages.en.blog.description} RSS: ${new URL(withBase(ROUTES.en.rss), site).href}`),
    link(pages.en.subscribe.title, new URL(withBase(ROUTES.en.subscribe), site).href, pages.en.subscribe.description),
    ...posts.filter(post => post.lang === 'en').map(post => link(post.title, post.url, `${post.date}. ${post.description}`)),
    link(`Release ${RELEASE}`, `${REPO}/releases/tag/${RELEASE}`, 'the release the landing installs'),
    '',
    '## Optional',
    '',
    link('Full text', new URL(withBase('/llms-full.txt'), site).href, 'the whole site (landing, about page and blog posts) in Markdown, in English and Spanish'),
    link('Español', pageUrl(content.es, site), content.en.seo.otherNote),
    link('README en español', `${REPO}/blob/main/README.es.md`, 'the README written in Spanish'),
    link(pages.es.about.title, new URL(withBase(ROUTES.es.about), site).href, 'the about page, written in Spanish'),
    link(pages.es.subscribe.title, new URL(withBase(ROUTES.es.subscribe), site).href, 'how to follow the Spanish blog by RSS, written in Spanish'),
    ...posts.filter(post => post.lang === 'es').map(post => link(post.title, post.url, `${post.date}. ${post.description}`)),
    '',
  ].join('\n')
}

// /llms-full.txt: every word of the landing, the about page and the blog, as Markdown, one language after the other.
export function llmsFull(site: URL, posts: LlmsPost[] = []) {
  const page = (t: Content) => {
    const h = t.hero
    const section = (kicker: string, title: string, ...body: string[]) => [`## ${kicker}: ${title}`, '', ...body.flatMap(part => [part, ''])]
    const list = (items: { title: string; body: string }[]) => items.map(item => `- **${item.title}.** ${item.body}`).join('\n')
    return [
      `# ${BRAND} · ${h.title.join(' ')}`,
      '',
      `URL: ${pageUrl(t, site)}`,
      '',
      h.lead,
      '',
      h.facts.map(fact => `- ${fact}`).join('\n'),
      '',
      ...section(t.specimens.kicker, t.specimens.title, `${t.specimens.lead} ${t.notes.fixes}.`, `${t.specimens.engines}`,
        t.specimens.items.map(item => `- ${item.kind} · ${item.id} · ${item.name} (${item.where}): ${item.note}`).join('\n')),
      ...section(t.change.kicker, t.change.title, t.change.lead, '```\n$ ' + t.change.command + '\n' + t.change.output.map(line => line.text).join('\n') + '\n```',
        `${t.change.action}. ${t.change.actionNote}`, '```yaml\n' + t.install.action + '\n```'),
      ...section(t.ledger.kicker, t.ledger.title, t.ledger.lead, list(t.ledger.points)),
      ...section(t.sources.kicker, t.sources.title, t.sources.lead, t.sources.tools.join(' · ')),
      ...section(t.ticket.kicker, t.ticket.title, t.ticket.lead),
      ...section(t.yours.kicker, t.yours.title, list(t.yours.items)),
      ...section(t.install.kicker, t.install.title, t.install.steps.map((step, index) => `${index + 1}. ${step}`).join('\n'),
        '```sh\n' + INSTALL + '\n```', '```yaml\n' + t.install.action + '\n```', `${t.install.note} ${t.install.docs}: ${DOCS}`),
      ...section(t.faq.kicker, t.faq.title, ...t.faq.items.map(item => `### ${item.q}\n\n${item.a}`)),
      `${t.footer.made} ${t.footer.license} © ${STEWARD.name} (${STEWARD.url}). ${REPO}`,
      '',
    ].join('\n')
  }
  const about = (t: Content) => {
    const a = pages[t.lang].about
    const rows = (items: { term: string; text: string }[]) => items.map(item => `- **${item.term}.** ${item.text}`).join('\n')
    return [
      `# ${a.title}`, '', `URL: ${new URL(withBase(ROUTES[t.lang].about), site).href}`, '', a.lead, '',
      `## ${a.why.title}`, '', ...a.why.body.flatMap(text => [text, '']),
      `## ${a.who.title}`, '', ...a.who.body.flatMap(text => [text, '']),
      `## ${a.principles.title}`, '', rows(a.principles.items), '',
      `## ${a.contribute.title}`, '', rows(a.contribute.items), '',
      `## ${a.contact.title}`, '', a.contact.body, '',
    ].join('\n')
  }
  const blog = (t: Content) => posts.filter(post => post.lang === t.lang)
    .map(post => [`# ${post.title}`, '', `URL: ${post.url}`, `Published: ${post.date}`, '', post.description, '', post.body.trim(), ''].join('\n'))
  const language = (t: Content) => [page(t), about(t), ...blog(t)].join('\n---\n\n')
  return `${language(content.en)}\n---\n\n${language(content.es)}`
}
