// The words of the pages beside the landing (the blog and the about page). Same rule as content.ts: each language is
// written for its readers, not translated, and nothing here says what Pitangus doesn't do today.
import type { Locale } from './content'
import { REPO } from './content'

export const ISSUES = `${REPO}/issues`
export const CONTRIBUTING = { en: `${REPO}/blob/main/.github/CONTRIBUTING.md`, es: `${REPO}/blob/main/.github/CONTRIBUTING.es.md` }
export const SECURITY_POLICY = { en: `${REPO}/blob/main/.github/SECURITY.md`, es: `${REPO}/blob/main/.github/SECURITY.es.md` }

// TODO(maintainer): fill in a photo (a file in public/, e.g. '/maintainer.jpg', at least 320 × 320) and a short bio in
// each language. Until then the about page leaves the block out; nothing placeholder-like is published.
export const MAINTAINER: { photo: string | null; photoAlt: Record<Locale, string>; bio: Record<Locale, string | null> } = {
  photo: null,
  photoAlt: { en: 'The Arodium team', es: 'El equipo de Arodium' },
  bio: { en: null, es: null },
}

export type Category = 'news' | 'security'

const en = {
  chrome: {
    home: 'Product',
    menu: 'Site',
    rss: 'RSS feed',
    theme: 'Switch between light and dark theme',
  },
  blog: {
    title: 'Blog',
    metaTitle: 'Pitangus blog: releases and project news',
    description: 'Release notes and news from Pitangus, the self-hosted, open-source application security tool, written by the Arodium team.',
    lead: 'Releases and news from the project, written by the Arodium team.',
    categories: { news: 'Pitangus news', security: 'Security' } satisfies Record<Category, string>,
    categoryNotes: {
      news: 'What each release brings and what changes in the project.',
      security: 'Application security beyond the product.',
    } satisfies Record<Category, string>,
    empty: 'Nothing here yet. Releases and project news are under Pitangus news.',
    subscribe: 'Follow new posts with the RSS feed',
    published: 'Published',
    updated: 'Updated',
    readingTime: (minutes: number) => `${minutes} min read`,
    tags: 'Tags',
    breadcrumb: 'Breadcrumb',
    otherLanguage: 'Leer en español',
    changelog: 'Full changelog',
    release: 'Release on GitHub',
    feedTitle: 'Pitangus blog',
    feedDescription: 'Releases and news from Pitangus, in English.',
  },
  about: {
    title: 'About Pitangus',
    metaTitle: 'About Pitangus: why it exists, who builds it, how to help',
    description: 'Pitangus is a self-hosted, open-source application security tool for small teams, made in Colombia by Arodium, a small team that builds software for clients and develops its own products. Its principles and how to contribute.',
    lead: 'Pitangus is a self-hosted, open-source application security tool for small teams. It finds problems in code, dependencies, secrets, infrastructure, container images and, if you turn it on, the sites you verify, and it counts a fix only when a later scan proves it.',
    why: {
      title: 'Why it exists',
      body: [
        'Small teams answer the same security questionnaires and audits as large companies, without a security team. The tools within their reach tend to fall into two groups: a long list of alerts nobody has time to sort, or a service their code has to be sent to.',
        'Pitangus takes the open-source engines those teams already trust, runs them on their own server, merges what they find into one registry without duplicates, and keeps what an auditor asks for: when each finding appeared, who decided what about it and why, and which scan proved it gone.',
      ],
    },
    who: {
      title: 'Who is behind it',
      body: [
        'Pitangus is made by Arodium, a small team in Colombia. For clients we build software (custom, mobile, web and e-commerce), integrate data, AI and business systems, run cloud and DevSecOps work, and do security testing: pentesting, application and code security, and cloud security reviews. We also develop our own products, and Pitangus is one of them: it comes from that security practice.',
        'The project is in beta: what each release changes, including what breaks, is in the changelog.',
      ],
    },
    principles: {
      title: 'Principles',
      items: [
        { term: 'Self-hosted', text: 'It runs on your server with Docker. Your code and your findings stay there.' },
        { term: 'No telemetry', text: 'Nothing is sent to us. It only reaches public advisory data, the image registries you scan, the domains you verify if you turn on web scans, and the services you connect.' },
        { term: 'Proves fixes', text: 'A finding is fixed when a later scan, whose engines finished, no longer finds it. If an engine fails, the scan says so and nothing it covers counts as fixed.' },
        { term: 'Never invents fixes', text: 'The fix shown is the tool’s own text, followed by links to the OWASP pages that apply. Pitangus doesn’t write remediation of its own.' },
        { term: 'Open source', text: 'GNU AGPL-3.0. Read every line, change it and run it without asking. Its SAST rules are MIT, so other tools can reuse them.' },
      ],
    },
    contribute: {
      title: 'How to contribute',
      items: [
        { term: 'Report a problem or ask', text: 'Open an issue on GitHub. Say what you ran, what you expected and what happened; never paste tokens or unreviewed logs.' },
        { term: 'Report a vulnerability', text: 'Privately, as the security policy explains. Not in a public issue.' },
        { term: 'Change the code', text: 'Open an issue first for big changes, then a pull request. The contributing guide lists the checks; your first pull request asks you to accept the contributor agreement.' },
        { term: 'Spread the word', text: 'If Pitangus helps your team, a star on GitHub or a mention helps other small teams find it.' },
      ],
      issues: 'Open an issue',
      guide: 'Contributing guide',
      security: 'Security policy',
    },
    contact: {
      title: 'Contact',
      body: 'Questions, ideas and problems go to GitHub issues, where answers stay public for the next person who asks.',
    },
    breadcrumb: 'Breadcrumb',
  },
}

const es: typeof en = {
  chrome: {
    home: 'Producto',
    menu: 'Sitio',
    rss: 'Feed RSS',
    theme: 'Cambiar entre tema claro y oscuro',
  },
  blog: {
    title: 'Blog',
    metaTitle: 'Blog de Pitangus: versiones y novedades del proyecto',
    description: 'Notas de versión y novedades de Pitangus, la herramienta autoalojada y de código abierto de seguridad de aplicaciones, escritas por el equipo de Arodium.',
    lead: 'Versiones y novedades del proyecto, contadas por el equipo que lo hace.',
    categories: { news: 'Novedades', security: 'Ciberseguridad' },
    categoryNotes: {
      news: 'Lo que trae cada versión y lo que cambia en el proyecto.',
      security: 'Seguridad de aplicaciones más allá del producto.',
    },
    empty: 'Todavía no hay nada aquí. Las versiones y novedades del proyecto están en Novedades.',
    subscribe: 'Sigue las entradas nuevas con el feed RSS',
    published: 'Publicado',
    updated: 'Actualizado',
    readingTime: (minutes: number) => `${minutes} min de lectura`,
    tags: 'Etiquetas',
    breadcrumb: 'Ruta de navegación',
    otherLanguage: 'Read in English',
    changelog: 'Changelog completo',
    release: 'Versión en GitHub',
    feedTitle: 'Blog de Pitangus',
    feedDescription: 'Versiones y novedades de Pitangus, en español.',
  },
  about: {
    title: 'Acerca de Pitangus',
    metaTitle: 'Acerca de Pitangus: por qué existe, quién lo hace y cómo ayudar',
    description: 'Pitangus es una herramienta autoalojada y de código abierto de seguridad de aplicaciones para equipos pequeños, hecha en Colombia por Arodium, un equipo pequeño que hace software para clientes y desarrolla productos propios. Sus principios y cómo contribuir.',
    lead: 'Pitangus es una herramienta autoalojada y de código abierto de seguridad de aplicaciones para equipos pequeños. Encuentra problemas en el código, las dependencias, los secretos, la infraestructura, las imágenes de contenedor y, si lo activas, los sitios que verificas, y solo da algo por corregido cuando un análisis posterior lo demuestra.',
    why: {
      title: 'Por qué existe',
      body: [
        'Los equipos pequeños responden los mismos cuestionarios de seguridad y las mismas auditorías que una empresa grande, pero sin un equipo de seguridad. Las herramientas a su alcance suelen caer en uno de dos lados: una lista larga de alertas que nadie tiene tiempo de ordenar, o un servicio al que hay que mandarle el código.',
        'Pitangus toma los motores de código abierto en los que esos equipos ya confían, los corre en su propio servidor, junta lo que encuentran en un solo registro sin duplicados y guarda lo que pide un auditor: cuándo apareció cada hallazgo, quién decidió qué y por qué, y qué análisis demostró que ya no está.',
      ],
    },
    who: {
      title: 'Quién está detrás',
      body: [
        'Pitangus lo hace Arodium, un equipo pequeño en Colombia. Para clientes hacemos software (a la medida, móvil, web y comercio electrónico), integramos datos, IA y sistemas empresariales, trabajamos en cloud y DevSecOps, y hacemos pruebas de seguridad: pentesting, seguridad de aplicaciones y de código, y revisiones de seguridad en la nube. También desarrollamos productos propios, y Pitangus es uno de ellos: sale de esa práctica de seguridad.',
        'El proyecto está en beta: lo que cambia en cada versión, también lo que se rompe, queda en el changelog.',
      ],
    },
    principles: {
      title: 'Principios',
      items: [
        { term: 'Autoalojado', text: 'Corre en tu servidor con Docker. Tu código y tus hallazgos se quedan ahí.' },
        { term: 'Sin telemetría', text: 'No nos envía nada. Solo sale a buscar avisos públicos, a los registros de las imágenes que analizas, a los dominios que verificas si activas los análisis web y a los servicios que conectas.' },
        { term: 'Demuestra las correcciones', text: 'Un hallazgo está corregido cuando un análisis posterior, con sus motores terminados, ya no lo encuentra. Si un motor falla, el análisis lo dice y nada de lo que cubre cuenta como corregido.' },
        { term: 'Nunca inventa correcciones', text: 'La corrección que muestra es el texto de la propia herramienta, seguido de los enlaces a las páginas de OWASP que aplican. Pitangus no redacta correcciones propias.' },
        { term: 'Código abierto', text: 'GNU AGPL-3.0. Lee cada línea, cámbiala y úsala sin pedir permiso. Sus reglas SAST son MIT, así que otras herramientas pueden reutilizarlas.' },
      ],
    },
    contribute: {
      title: 'Cómo contribuir',
      items: [
        { term: 'Reportar un problema o preguntar', text: 'Abre un issue en GitHub. Cuenta qué corriste, qué esperabas y qué pasó; nunca pegues tokens ni logs sin revisar.' },
        { term: 'Reportar una vulnerabilidad', text: 'En privado, como explica la política de seguridad. No en un issue público.' },
        { term: 'Cambiar el código', text: 'Para cambios grandes, abre primero un issue y luego una pull request. La guía de contribución dice qué pruebas correr; en tu primera pull request se te pide aceptar el acuerdo de contribución.' },
        { term: 'Correr la voz', text: 'Si Pitangus le sirve a tu equipo, una estrella en GitHub o una mención ayuda a que otros equipos pequeños lo encuentren.' },
      ],
      issues: 'Abrir un issue',
      guide: 'Guía de contribución',
      security: 'Política de seguridad',
    },
    contact: {
      title: 'Contacto',
      body: 'Las preguntas, ideas y problemas van a los issues de GitHub, donde las respuestas quedan públicas para la próxima persona que pregunte.',
    },
    breadcrumb: 'Ruta de navegación',
  },
}

export const pages = { en, es }
export type Pages = typeof en
