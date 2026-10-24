const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initProjects() {
  const filters = document.querySelector('.filters')
  const items = [...document.querySelectorAll('.project')]
  const status = document.querySelector('[data-projects-status]')
  if (!filters || items.length === 0) return

  // Cada tarjeta necesita un nombre único para que la View Transition la siga.
  items.forEach((item, index) => {
    item.style.viewTransitionName = `project-${index}`
  })

  const apply = (filter) => {
    let visible = 0

    items.forEach((item) => {
      const matches = filter === 'todos' || item.dataset.category === filter
      item.hidden = !matches
      if (matches) visible += 1
    })

    filters.querySelectorAll('[data-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter))
    })

    status.textContent = visible === 1 ? 'Mostrando 1 proyecto' : `Mostrando ${visible} proyectos`
  }

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]')
    if (!button || button.getAttribute('aria-pressed') === 'true') return

    const update = () => apply(button.dataset.filter)

    // View Transitions API: el navegador anima el cambio. Si no existe, se aplica directo.
    if (document.startViewTransition && !reduceMotion()) {
      document.startViewTransition(update)
    } else {
      update()
    }
  })

  filters.hidden = false
}