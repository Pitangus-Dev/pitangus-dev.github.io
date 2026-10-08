// The landing's words. Each language is written for its own readers (Latin American Spanish, tú), not translated.
// Only what Pitangus does today: no numbers we can't back, no "AI-powered".

export type Locale = 'en' | 'es'

// The name the page shows. The repository, the images, the CLI and the Action keep their current names until the
// product itself is renamed: the commands below must keep working as written.
export const BRAND = 'Pitangus'
export const REPO = 'https://github.com/Tamandua-AppSec/tamandua'
export const DOCS = `${REPO}/tree/main/docs`
// Who stands behind Pitangus, named once at the foot of the page.
export const STEWARD = { name: 'Arodium', url: 'https://arodium.com' }
// The release the landing installs and shows in its workflow snippets.
export const RELEASE = 'v0.11.0'
export const ACTION_STEP = `- uses: Tamandua-AppSec/tamandua@${RELEASE}`
// The published release with its published images: a clone of main could ask for images not released yet.
export const INSTALL = `git clone --branch ${RELEASE} https://github.com/Tamandua-AppSec/tamandua.git\ncd tamandua\nmake setup PREBUILT=1\nmake up`

const en = {
  lang: 'en',
  meta: {
    title: 'Pitangus · Watch every change. Prove every fix.',
    description: 'Self-hosted, open-source application security for small teams: scans your code, verifies every fix and keeps the evidence. In English and Spanish.',
  },
  nav: { label: 'Sections', specimens: 'Specimens', change: 'Your change', ledger: 'Ledger', install: 'Install', code: 'Code', other: 'Español', otherHref: '/es/' },
  motion: { pause: 'Pause motion', play: 'Play motion' },
  theme: { label: 'Switch between day and night notebook' },
  skip: 'Skip to content',
  counter: { label: 'bugs caught', one: 'bug caught', aria: 'Bugs caught while you read' },
  hero: {
    plate: 'Plate I',
    species: 'Pitangus sulphuratus',
    drawing: 'Pitangus sulphuratus, the great kiskadee, perched on a branch: a naturalist’s plate in pencil, ink and watercolour',
    habitat: 'Habitat: your repositories. Diet: bugs.',
    record: 'Specimen Nº 001 · Tyrannidae',
    marks: { bill: 'heavy bill', mask: 'black mask', breast: 'sulphur-yellow breast' },
    title: ['Watch every change.', 'Prove every fix.'],
    accent: 1,
    lead: 'Self-hosted application security for small teams. Pitangus scans your code, dependencies and secrets, tells you what each change introduces and what it fixes, and keeps the evidence an auditor can check.',
    primary: 'Install in 5 minutes',
    secondary: 'Read the code',
    vertical: 'SPOT IT · FIX IT · PROVE IT',
    facts: ['Open source · AGPL-3.0', 'Runs on your server', 'No telemetry'],
  },
  specimens: {
    number: '01',
    kicker: 'Field guide',
    title: 'Every bug, catalogued like a specimen.',
    lead: 'Seven open engines you already trust look at your code, dependencies, secrets, infrastructure and images. Pitangus merges what they find, removes duplicates and files each finding with where it lives and how to fix it.',
    engines: 'Opengrep · Gitleaks · Trivy · OSV-Scanner · Grype · Checkov · zizmor',
    items: [
      { id: 'CWE-89', name: 'SQL injection', where: 'app/db.py:14', kind: 'Code', note: 'Request input reaches a query built as text.' },
      { id: 'CVE-2021-23337', name: 'lodash 4.17.15', where: 'package-lock.json', kind: 'Dependency', note: 'Update to 4.18.0: it closes all six advisories.' },
      { id: 'CWE-798', name: 'GitHub token', where: 'config/settings.py:3', kind: 'Secret', note: 'Revoke it first. Its value never leaves your server.' },
      { id: 'CKV_AWS_20', name: 'Public bucket', where: 'infra/s3.tf:8', kind: 'Infrastructure', note: 'Anyone could list it. Block public access.' },
    ],
    captured: 'Caught',
  },
  change: {
    number: '02',
    kicker: 'Pull requests',
    title: 'Only what your change brings. And what it fixes.',
    lead: 'In CI, Pitangus scans the starting point and your change with the same engines, so a pull request is judged only by what it adds. It also says what the change fixed, and credits it only when both scans finished and the file really changed.',
    command: 'tamandua scan --base main',
    output: [
      { tone: 'muted', text: 'Tamandua · api · changes since main (merge-base 4f2a9c1e, 1 file)' },
      { tone: 'plain', text: '' },
      { tone: 'plain', text: 'No new findings.' },
      { tone: 'plain', text: '' },
      { tone: 'ok', text: 'Fixed by this change (1): it was in the starting point, it’s gone, and its file changed.' },
      { tone: 'ok', text: '  HIGH     app/db.py:14  SQL injection from request input' },
      { tone: 'plain', text: '' },
      { tone: 'strong', text: 'PASS · threshold: high or above · No new findings in the code that changes' },
    ],
    action: 'One step in your workflow',
    actionNote: 'The official GitHub Action runs the published image: no build, no Docker socket.',
  },
  ledger: {
    number: '03',
    kicker: 'The ledger',
    title: 'Fixed means verified. Not assumed.',
    lead: 'Each finding keeps its history: when it appeared, who triaged it and why, its deadline from your policy, and the scan that proved it gone. Decisions are recorded, not overwritten.',
    columns: ['Finding', 'Status', 'Deadline'],
    rows: [
      { finding: 'SQL injection · app/db.py:14', status: 'Fixed', date: 'Oct 20' },
      { finding: 'lodash 4.17.15 · 6 vulnerabilities', status: 'Open', date: 'Oct 30' },
      { finding: 'Public bucket · infra/s3.tf', status: 'Accepted risk', date: 'Until Dec 1' },
    ],
    stamp: 'VERIFIED',
    stampNote: 'by scan 9f3c… on Oct 2',
    points: [
      { title: 'Deterministic', body: 'The same code, engines and advisory data give the same result. An auditor can repeat it.' },
      { title: 'Evidence', body: 'SBOM (CycloneDX), VEX (OpenVEX), SLA reports and an audit trail of every decision.' },
      { title: 'Honest about gaps', body: 'If an engine fails, the scan says so, and nothing that engine looks at counts as fixed. It never reads as “no findings”.' },
    ],
  },
  sources: {
    number: '04',
    kicker: 'Any tool, one ledger',
    title: 'Bring what other tools find.',
    lead: 'Import SARIF from any scanner or AI reviewer. Its findings join the same registry, with triage, deadlines and tickets. Only a new full import from that same tool can mark them fixed: each tool vouches for what it looks at.',
    tools: ['Semgrep', 'CodeQL', 'Snyk', 'Trivy', 'Grype', 'Bandit', 'ESLint', 'Strix', 'Any SARIF 2.1.0'],
  },
  ticket: {
    number: '05',
    kicker: 'Jira',
    title: 'Tickets a developer can act on.',
    lead: 'Issues go to the right project for each repository, with your custom fields. They say what is wrong, where, how to fix it, how to verify it and by when. When the fix is verified, Pitangus comments on the issue.',
    card: {
      key: 'SEC-142',
      title: 'High: update lodash 4.17.15 to 4.18.0 (6 vulnerabilities)',
      sections: [
        ['The problem', 'lodash 4.17.15 has 6 known vulnerabilities. Version 4.18.0 fixes all of them.'],
        ['Where', 'acme/web · package-lock.json'],
        ['How to fix it', 'npm install lodash@4.18.0'],
        ['Due date', 'Oct 30, from your security policy'],
      ],
      back: 'Verified as fixed by Pitangus in scan 9f3c… on Oct 2.',
    },
  },
  yours: {
    number: '06',
    kicker: 'Yours',
    title: 'Runs on your server. Speaks your language.',
    items: [
      { title: 'Self-hosted', body: 'One server with Docker and 4 GB of memory. Your code and findings stay with you.' },
      { title: 'Open source', body: 'AGPL-3.0. Read every line, change it, run it without asking.' },
      { title: 'English and Spanish', body: 'Written for each language, not machine-translated. Reports, PR comments and tickets included.' },
      { title: 'No telemetry', body: 'Nothing phones home. It only reaches out for public advisory data and, if you connect them, GitHub and Jira.' },
    ],
  },
  install: {
    number: '07',
    kicker: 'Install',
    title: 'Five minutes, one server.',
    steps: ['You need Docker, make and git.', 'Start it and open the panel.', 'Or add the Action to your workflow.'],
    shell: INSTALL,
    action: ACTION_STEP,
    copy: 'Copy',
    copyShell: 'Copy the install commands',
    copyAction: 'Copy the workflow step',
    copied: 'Copied',
    docs: 'Read the docs',
    note: 'Free and open source (AGPL-3.0). It runs on your server: no account, no telemetry.',
  },
  footer: {
    colophon: 'Field notes on Pitangus sulphuratus, the great kiskadee: it hunts bugs of every kind, in the air or on the ground, and boldly takes on hawks far bigger than itself.',
    made: 'Made in Colombia.',
    license: 'Pitangus is free software under AGPL-3.0.',
    links: [['Code', REPO], ['Docs', DOCS], ['Security', `${REPO}/blob/main/.github/SECURITY.md`]],
    credits: 'Animations by GSAP (Standard “no charge” license).',
  },
  notes: {
    hero: 'they get into every repo',
    secret: 'never shows the value!',
    change: 'only what YOUR change brought',
    ledger: 'proved, not assumed',
    sources: 'what Semgrep found, only Semgrep closes',
    ticket: 'finally, one a dev understands',
    install: 'really: five minutes',
  },
  og: 'Self-hosted, open source application security for small teams.',
  notFound: { title: 'Nothing to catch here.', body: 'This page flew off. The kiskadee is still watching from its branch.', back: 'Back to the field guide' },
}

const es: typeof en = {
  lang: 'es',
  meta: {
    title: 'Pitangus · Vigila cada cambio. Demuestra cada corrección.',
    description: 'Seguridad de aplicaciones autoalojada y de código abierto para equipos pequeños: analiza tu código, verifica cada corrección y guarda la evidencia. En español y en inglés.',
  },
  nav: { label: 'Secciones', specimens: 'Especímenes', change: 'Tu cambio', ledger: 'Registro', install: 'Instalar', code: 'Código', other: 'English', otherHref: '/' },
  motion: { pause: 'Pausar animaciones', play: 'Activar animaciones' },
  theme: { label: 'Cambiar entre el cuaderno de día y el de noche' },
  skip: 'Ir al contenido',
  counter: { label: 'bugs atrapados', one: 'bug atrapado', aria: 'Bugs atrapados mientras lees' },
  hero: {
    plate: 'Lámina I',
    species: 'Pitangus sulphuratus',
    drawing: 'Pitangus sulphuratus, el bichofué, posado en una rama: lámina de naturalista a lápiz, tinta y acuarela',
    habitat: 'Hábitat: tus repositorios. Dieta: bugs.',
    record: 'Ejemplar Nº 001 · Tyrannidae',
    marks: { bill: 'pico robusto', mask: 'antifaz negro', breast: 'pecho amarillo azufre' },
    title: ['Vigila cada cambio.', 'Demuestra', 'cada corrección.'],
    accent: 1,
    lead: 'Seguridad de aplicaciones autoalojada para equipos pequeños. Pitangus analiza tu código, tus dependencias y tus secretos, te dice qué introduce y qué corrige cada cambio, y guarda la evidencia que un auditor puede comprobar.',
    primary: 'Instálalo en 5 minutos',
    secondary: 'Ver el código',
    vertical: 'DETÉCTALO · CORRÍGELO · DEMUÉSTRALO',
    facts: ['Código abierto · AGPL-3.0', 'Corre en tu servidor', 'Sin telemetría'],
  },
  specimens: {
    number: '01',
    kicker: 'Guía de campo',
    title: 'Cada bug, catalogado como un espécimen.',
    lead: 'Siete motores abiertos en los que ya confías revisan tu código, dependencias, secretos, infraestructura e imágenes. Pitangus junta lo que encuentran, quita los duplicados y archiva cada hallazgo con dónde vive y cómo corregirlo.',
    engines: 'Opengrep · Gitleaks · Trivy · OSV-Scanner · Grype · Checkov · zizmor',
    items: [
      { id: 'CWE-89', name: 'Inyección SQL', where: 'app/db.py:14', kind: 'Código', note: 'La entrada de la petición llega a una consulta armada con texto.' },
      { id: 'CVE-2021-23337', name: 'lodash 4.17.15', where: 'package-lock.json', kind: 'Dependencia', note: 'Actualiza a 4.18.0: cierra los seis avisos.' },
      { id: 'CWE-798', name: 'Token de GitHub', where: 'config/settings.py:3', kind: 'Secreto', note: 'Revócalo primero. Su valor nunca sale de tu servidor.' },
      { id: 'CKV_AWS_20', name: 'Bucket público', where: 'infra/s3.tf:8', kind: 'Infraestructura', note: 'Cualquiera podría listarlo. Bloquea el acceso público.' },
    ],
    captured: 'Atrapado',
  },
  change: {
    number: '02',
    kicker: 'Pull requests',
    title: 'Solo lo que trae tu cambio. Y lo que corrige.',
    lead: 'En CI, Pitangus analiza el punto de partida y tu cambio con los mismos motores, así que una pull request se juzga solo por lo que añade. También dice qué corrigió, y solo se lo atribuye si los dos análisis terminaron y el archivo cambió de verdad.',
    command: 'tamandua scan --base main',
    output: [
      { tone: 'muted', text: 'Tamandua · api · cambios respecto a main (merge-base 4f2a9c1e, 1 archivo)' },
      { tone: 'plain', text: '' },
      { tone: 'plain', text: 'Sin hallazgos nuevos.' },
      { tone: 'plain', text: '' },
      { tone: 'ok', text: 'Corregido en este cambio (1): estaba en el punto de partida, ya no está y su archivo cambió.' },
      { tone: 'ok', text: '  ALTA     app/db.py:14  Inyección SQL desde la petición' },
      { tone: 'plain', text: '' },
      { tone: 'strong', text: 'PASA · umbral: alta o superior · Sin hallazgos nuevos en el código que cambia' },
    ],
    action: 'Un paso en tu workflow',
    actionNote: 'La GitHub Action oficial usa la imagen publicada: sin compilar y sin socket de Docker.',
  },
  ledger: {
    number: '03',
    kicker: 'El registro',
    title: 'Corregido quiere decir verificado. No supuesto.',
    lead: 'Cada hallazgo guarda su historia: cuándo apareció, quién lo revisó y por qué, su plazo según tu política y el análisis que demostró que ya no está. Las decisiones se registran, no se sobrescriben.',
    columns: ['Hallazgo', 'Estado', 'Plazo'],
    rows: [
      { finding: 'Inyección SQL · app/db.py:14', status: 'Corregido', date: '20 oct' },
      { finding: 'lodash 4.17.15 · 6 vulnerabilidades', status: 'Abierto', date: '30 oct' },
      { finding: 'Bucket público · infra/s3.tf', status: 'Riesgo aceptado', date: 'Hasta el 1 dic' },
    ],
    stamp: 'VERIFICADO',
    stampNote: 'por el análisis 9f3c… del 2 oct',
    points: [
      { title: 'Determinista', body: 'El mismo código, con los mismos motores y los mismos datos de avisos, da el mismo resultado. Un auditor lo puede repetir.' },
      { title: 'Evidencia', body: 'SBOM (CycloneDX), VEX (OpenVEX), informes de SLA y el rastro de cada decisión.' },
      { title: 'Honesto con lo que falta', body: 'Si un motor falla, el análisis lo dice, y nada de lo que mira ese motor cuenta como corregido. Nunca se lee como «sin hallazgos».' },
    ],
  },
  sources: {
    number: '04',
    kicker: 'Cualquier herramienta, un registro',
    title: 'Trae lo que encuentran otras herramientas.',
    lead: 'Importa SARIF de cualquier escáner o revisor con IA. Sus hallazgos entran al mismo registro, con triage, plazos e incidencias. Solo una nueva importación completa de esa misma herramienta puede darlos por corregidos: cada herramienta responde por lo que mira.',
    tools: ['Semgrep', 'CodeQL', 'Snyk', 'Trivy', 'Grype', 'Bandit', 'ESLint', 'Strix', 'Cualquier SARIF 2.1.0'],
  },
  ticket: {
    number: '05',
    kicker: 'Jira',
    title: 'Incidencias con las que un desarrollador puede trabajar.',
    lead: 'Cada repositorio manda sus incidencias al proyecto que le toca, con tus campos personalizados. Dicen qué pasa, dónde, cómo corregirlo, cómo comprobarlo y para cuándo. Cuando la corrección se verifica, Pitangus lo comenta en la incidencia.',
    card: {
      key: 'SEC-142',
      title: 'Alta: actualizar lodash 4.17.15 a 4.18.0 (6 vulnerabilidades)',
      sections: [
        ['El problema', 'lodash 4.17.15 tiene 6 vulnerabilidades conocidas. La versión 4.18.0 las corrige todas.'],
        ['Dónde', 'acme/web · package-lock.json'],
        ['Cómo corregirlo', 'npm install lodash@4.18.0'],
        ['Plazo de corrección', '30 oct, según tu política de seguridad'],
      ],
      back: 'Pitangus verificó la corrección en el análisis 9f3c… del 2 oct.',
    },
  },
  yours: {
    number: '06',
    kicker: 'Tuyo',
    title: 'Corre en tu servidor. Habla tu idioma.',
    items: [
      { title: 'Autoalojado', body: 'Un servidor con Docker y 4 GB de memoria. Tu código y tus hallazgos se quedan contigo.' },
      { title: 'Código abierto', body: 'AGPL-3.0. Lee cada línea, cámbiala y úsala sin pedir permiso.' },
      { title: 'Español e inglés', body: 'Escrito para cada idioma, no traducido a máquina. Informes, comentarios de PR e incidencias incluidos.' },
      { title: 'Sin telemetría', body: 'No llama a casa. Solo sale a buscar avisos públicos y, si los conectas, a GitHub y Jira.' },
    ],
  },
  install: {
    number: '07',
    kicker: 'Instalar',
    title: 'Cinco minutos, un servidor.',
    steps: ['Necesitas Docker, make y git.', 'Arráncalo y abre el panel.', 'O añade la Action a tu workflow.'],
    shell: INSTALL,
    action: ACTION_STEP,
    copy: 'Copiar',
    copyShell: 'Copiar los comandos de instalación',
    copyAction: 'Copiar el paso del workflow',
    copied: 'Copiado',
    docs: 'Leer la documentación',
    note: 'Libre y de código abierto (AGPL-3.0). Corre en tu servidor: sin cuenta y sin telemetría.',
  },
  footer: {
    colophon: 'Notas de campo sobre Pitangus sulphuratus, el bichofué: caza bichos de todo tipo, en el aire o en el suelo, y enfrenta sin miedo a gavilanes mucho más grandes que él.',
    made: 'Hecho en Colombia.',
    license: 'Pitangus es software libre bajo AGPL-3.0.',
    links: [['Código', REPO], ['Documentación', DOCS], ['Seguridad', `${REPO}/blob/main/.github/SECURITY.es.md`]],
    credits: 'Animaciones con GSAP (licencia estándar «no charge»).',
  },
  notes: {
    hero: 'se meten en todos los repos',
    secret: '¡nunca muestra el valor!',
    change: 'solo lo que trajo TU cambio',
    ledger: 'comprobado, no supuesto',
    sources: 'lo que encontró Semgrep, solo Semgrep lo cierra',
    ticket: 'por fin, una que un dev entiende',
    install: 'de verdad: cinco minutos',
  },
  og: 'Seguridad de aplicaciones autoalojada y de código abierto para equipos pequeños.',
  notFound: { title: 'Aquí no hay nada que atrapar.', body: 'Esta página se fue volando. El bichofué sigue vigilando desde su rama.', back: 'Volver a la guía de campo' },
}

export const content = { en, es }
export type Content = typeof en
