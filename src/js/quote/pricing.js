import { projectTypes } from '../data/project-types.js'
import { scopes, extras, rush, rangeSpread } from '../data/quote-options.js'

const STEP = 100000

const roundToStep = (value) => Math.round(value / STEP) * STEP

const findOrThrow = (list, id, label) => {
  const item = list.find((entry) => entry.id === id)
  if (!item) throw new Error(`${label} desconocido: ${id}`)
  return item
}

/**
 * Calcula el estimado de un proyecto.
 * Función pura: no toca el DOM, así se puede probar sola.
 *
 * @param {{ typeId: string, scopeId: string, extraIds?: string[], isRush?: boolean }} selection
 * @returns {{ min: number, max: number, weeks: number, lines: { label: string, amount: number }[] }}
 */
export function calculateQuote({ typeId, scopeId, extraIds = [], isRush = false }) {
  const type = findOrThrow(projectTypes, typeId, 'Tipo de proyecto')
  const scope = findOrThrow(scopes, scopeId, 'Alcance')
  const chosenExtras = [...new Set(extraIds)].map((id) => findOrThrow(extras, id, 'Extra'))

  const baseAmount = Math.round(type.basePrice * scope.priceFactor)
  const extrasAmount = chosenExtras.reduce((sum, extra) => sum + extra.price, 0)
  const subtotal = baseAmount + extrasAmount
  const rushAmount = isRush ? Math.round(subtotal * (rush.priceFactor - 1)) : 0
  const total = subtotal + rushAmount

  const baseWeeks = type.weeks * scope.timeFactor + chosenExtras.reduce((sum, extra) => sum + extra.weeks, 0)
  const weeks = Math.max(1, Math.ceil(baseWeeks * (isRush ? rush.timeFactor : 1)))

  const lines = [
    { label: `${type.name} · ${scope.name}`, amount: baseAmount },
    ...chosenExtras.map((extra) => ({ label: extra.name, amount: extra.price })),
  ]
  if (isRush) lines.push({ label: 'Entrega urgente', amount: rushAmount })

  return {
    min: roundToStep(total),
    max: roundToStep(total * rangeSpread),
    weeks,
    lines,
  }
}