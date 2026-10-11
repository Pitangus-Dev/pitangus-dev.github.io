// Runs inline in the <head> of every page, before paint. One script for every page, so one SHA-256 in the CSP
// (integrations/security-headers.mjs adds it at build time and checks that every inline script is covered).
// What it does: JS is here; the theme this visitor chose, if any; and, on the notebook pages (html[data-notebook]),
// whether motion was turned off and whether the entrance must wait for the motion script. Storage is a convenience: it
// may be unavailable.
export const BOOT = `{
const root = document.documentElement
root.classList.replace('no-js', 'js')
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
