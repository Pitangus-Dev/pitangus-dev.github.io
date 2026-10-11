// The site may live under a path (BASE_PATH): every internal link goes through here.
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`
// The pages besides the landing, per language. Spanish slugs are written for Spanish readers. rss is the feed itself
// (for <link rel="alternate"> and readers); people are sent to subscribe, which explains it.
export const ROUTES = {
  en: { home: '/', blog: '/blog/', about: '/about/', rss: '/blog/rss.xml', subscribe: '/blog/subscribe/' },
  es: { home: '/es/', blog: '/es/blog/', about: '/es/nosotros/', rss: '/es/blog/rss.xml', subscribe: '/es/blog/suscribirse/' },
} as const
