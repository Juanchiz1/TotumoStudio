// Debe coincidir con el breakpoint 'lg' de _tokens.scss
const DESKTOP = '(min-width: 1024px)'

export function initNav() {
  const header = document.querySelector('.site-header')
  const toggle = header?.querySelector('.nav-toggle')
  const nav = header?.querySelector('.site-nav')
  if (!header || !toggle || !nav) return

  const isOpen = () => header.dataset.nav === 'open'

  const setOpen = (open) => {
    header.dataset.nav = open ? 'open' : 'closed'
    toggle.setAttribute('aria-expanded', String(open))
  }

  toggle.hidden = false
  setOpen(false)

  toggle.addEventListener('click', () => setOpen(!isOpen()))

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false)
      toggle.focus()
    }
  })

  window.matchMedia(DESKTOP).addEventListener('change', (event) => {
    if (event.matches) setOpen(false)
  })
}