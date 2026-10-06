import { projectTypes } from './data/project-types.js'
import { formatCOP } from './utils/format.js'

const ROTATE_MS = 3500

export function initHero() {
  const demo = document.querySelector('.hero__demo')
  if (!demo) return

  const mock = demo.querySelector('.mock')
  const url = demo.querySelector('.mock__url')
  const switcher = demo.querySelector('.demo-switch')
  const captionName = demo.querySelector('.demo-caption__name')
  const captionMeta = demo.querySelector('.demo-caption__meta')

  const buttons = projectTypes.map((type) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'demo-switch__btn'
    button.dataset.type = type.id
    button.textContent = type.shortName
    switcher.append(button)
    return button
  })

  let current = mock.dataset.type
  let timer = null
  let userChose = false

  const render = (id) => {
    const type = projectTypes.find((item) => item.id === id)
    if (!type) return

    current = id
    mock.dataset.type = id
    url.textContent = type.url
    captionName.textContent = type.name
    captionMeta.textContent = `desde ${formatCOP(type.basePrice)} · ${type.weeks} semanas`
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.type === id))
    })
  }

  const next = () => {
    const index = projectTypes.findIndex((item) => item.id === current)
    render(projectTypes[(index + 1) % projectTypes.length].id)
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const start = () => {
    if (reduceMotion || userChose || timer !== null) return
    timer = setInterval(next, ROTATE_MS)
  }

  const stop = () => {
    clearInterval(timer)
    timer = null
  }

  switcher.addEventListener('click', (event) => {
    const button = event.target.closest('button')
    if (!button) return
    userChose = true
    stop()
    render(button.dataset.type)
  })

  // La rotación se pausa mientras el usuario mira o navega la demo.
  demo.addEventListener('pointerenter', stop)
  demo.addEventListener('pointerleave', start)
  demo.addEventListener('focusin', stop)
  demo.addEventListener('focusout', start)

  switcher.hidden = false
  render(current)
  start()
}