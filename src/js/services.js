import { projectTypes } from './data/project-types.js'
import { formatCOP } from './utils/format.js'

// Los precios "desde" salen de project-types.js para no duplicarlos en el HTML.
export function initServices() {
  document.querySelectorAll('[data-price-from]').forEach((element) => {
    const type = projectTypes.find((item) => item.id === element.dataset.priceFrom)
    if (type) element.textContent = formatCOP(type.basePrice)
  })
}