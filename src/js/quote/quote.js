import { projectTypes } from '../data/project-types.js'
import { scopes, extras, deliveryOptions } from '../data/quote-options.js'
import { calculateQuote } from './pricing.js'
import { quoteStore } from './store.js'
import { formatCOP, formatMillions } from '../utils/format.js'

const CHECK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7" /></svg>'

// Los datos son nuestros (archivos de data/), no texto del usuario,
// por eso es seguro armar el HTML con template literals.
const optionHTML = ({ inputType, name, value, title, description, price }) => `
  <label class="option${inputType === 'checkbox' ? ' option--check' : ''}">
    <input type="${inputType}" name="${name}" value="${value}" />
    <span class="option__mark" aria-hidden="true">${CHECK_ICON}</span>
    <span class="option__name">${title}</span>
    ${description ? `<span class="option__desc">${description}</span>` : ''}
    ${price ? `<span class="option__price mono">${price}</span>` : ''}
  </label>`

const GROUPS = {
  type: projectTypes.map((type) => ({
    inputType: 'radio',
    name: 'type',
    value: type.id,
    title: type.name,
    description: type.description,
    price: `desde ${formatCOP(type.basePrice)}`,
  })),
  scope: scopes.map((scope) => ({
    inputType: 'radio',
    name: 'scope',
    value: scope.id,
    title: scope.name,
    description: scope.description,
  })),
  extra: extras.map((extra) => ({
    inputType: 'checkbox',
    name: 'extra',
    value: extra.id,
    title: extra.name,
    price: `+ ${formatCOP(extra.price)}`,
  })),
  delivery: deliveryOptions.map((option) => ({
    inputType: 'radio',
    name: 'delivery',
    value: option.id,
    title: option.name,
    description: option.description,
  })),
}

const readForm = (form) => {
  const data = new FormData(form)
  return {
    typeId: data.get('type'),
    scopeId: data.get('scope'),
    extraIds: data.getAll('extra'),
    isRush: data.get('delivery') === 'urgente',
  }
}

const syncForm = (form, state) => {
  form.querySelectorAll('input').forEach((input) => {
    if (input.name === 'type') input.checked = input.value === state.typeId
    if (input.name === 'scope') input.checked = input.value === state.scopeId
    if (input.name === 'extra') input.checked = state.extraIds.includes(input.value)
    if (input.name === 'delivery') input.checked = input.value === (state.isRush ? 'urgente' : 'normal')
  })
}

export function initQuote() {
  const form = document.querySelector('.quote-form')
  const summary = document.querySelector('.quote-summary')
  if (!form || !summary) return

  form.querySelectorAll('[data-options]').forEach((container) => {
    container.innerHTML = GROUPS[container.dataset.options].map(optionHTML).join('')
  })

  const rangeOutput = summary.querySelector('[data-quote="range"]')
  const weeksOutput = summary.querySelector('[data-quote="weeks"]')
  const linesOutput = summary.querySelector('[data-quote="lines"]')

  const renderSummary = (state) => {
    const quote = calculateQuote(state)
    rangeOutput.textContent = `$${formatMillions(quote.min)} – $${formatMillions(quote.max)}`
    weeksOutput.textContent = quote.weeks === 1 ? '1 semana' : `${quote.weeks} semanas`
    linesOutput.innerHTML = quote.lines
      .map((line) => `<li><span>${line.label}</span><span class="mono">${formatCOP(line.amount)}</span></li>`)
      .join('')
  }

  const render = (state) => {
    syncForm(form, state)
    renderSummary(state)
  }

  form.addEventListener('change', () => quoteStore.set(readForm(form)))
  form.addEventListener('submit', (event) => event.preventDefault())

  // "Cotizar una tienda", "Cotizar un sitio"... en la sección de servicios.
  document.querySelectorAll('[data-select-type]').forEach((link) => {
    link.addEventListener('click', () => quoteStore.set({ typeId: link.dataset.selectType }))
  })

  quoteStore.subscribe(render)
  render(quoteStore.get())
}