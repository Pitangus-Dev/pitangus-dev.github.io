// Runs inline in the <head> of every page, before paint. One script for every page, so one SHA-256 in the CSP
// (integrations/security-headers.mjs adds it at build time and checks that every inline script is covered).
// What it does: JS is here; the theme this visitor chose, if any, the theme button and the copy buttons (one click
// handler on the document, so it works on every page without another script); and, on the notebook pages (html[data-notebook]),
// whether motion was turned off and whether the entrance must wait for the motion script. Storage is a convenience: it
// may be unavailable.
export const BOOT = `{
const root = document.documentElement
root.classList.replace('no-js', 'js')
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return
  // A copy button (data-copy: the id of the element whose text it copies). The text is also selected, so it can be
  // copied by hand where the clipboard is unavailable.
  const copy = event.target.closest('[data-copy]')
  if (copy instanceof HTMLElement) {
    const source = document.getElementById(copy.dataset.copy || '')
    if (!source) return
    getSelection()?.selectAllChildren(source)
    const done = () => {
      const status = copy.parentElement?.querySelector('[role="status"]')
      if (status) status.textContent = copy.dataset.copied || ''
      copy.dataset.label ??= copy.textContent || ''
      copy.textContent = copy.dataset.copied || ''
      setTimeout(() => { copy.textContent = copy.dataset.label || ''; if (status) status.textContent = '' }, 2000)
    }
    navigator.clipboard?.writeText((source.textContent || '').trim()).then(done, () => {})
    return
  }
  if (!event.target.closest('[data-theme-toggle]')) return
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  root.dataset.theme = dark ? 'light' : 'dark'
  try { localStorage.setItem('pitangus-theme', root.dataset.theme) } catch {}
})
try {
  const theme = localStorage.getItem('pitangus-theme')
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme
  if ('notebook' in root.dataset) {
    if (localStorage.getItem('pitangus-motion') === 'off') root.classList.add('still')
    // Arriving from the other language, the page turns (a view transition): it must already be complete, not blank
    // waiting for its entrance, or the turn shows an empty page that then fills in.
    const turned = sessionStorage.getItem('pitangus-turn') === '1'
    sessionStorage.removeItem('pitangus-turn')
    if (!turned && !root.classList.contains('still') && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      root.classList.add('pending')
      setTimeout(() => root.classList.remove('pending'), 1500)  // the script never came: show everything
    }
  }
} catch {}
}`
