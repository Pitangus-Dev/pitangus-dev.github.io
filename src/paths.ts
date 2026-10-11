// The site may live under a path (BASE_PATH): every internal link goes through here.
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`
// The pages besides the landing, per language. Spanish slugs are written for Spanish readers.
export const ROUTES = {
  en: { home: '/', blog: '/blog/', about: '/about/', rss: '/blog/rss.xml' },
  es: { home: '/es/', blog: '/es/blog/', about: '/es/nosotros/', rss: '/es/blog/rss.xml' },
} as const
