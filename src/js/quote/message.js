import { projectTypes } from '../data/project-types.js'
import { scopes, extras } from '../data/quote-options.js'
import { calculateQuote } from './pricing.js'
import { formatCOP } from '../utils/format.js'

const ARTICLES = { landing: 'una', sitio: 'un', tienda: 'una', app: 'una' }

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1)

/**
 * Convierte la selección del cotizador en el texto que se precarga en el formulario de contacto.
 */
export function buildQuoteMessage(selection) {
  const quote = calculateQuote(selection)
  const type = projectTypes.find((item) => item.id === selection.typeId)
  const scope = scopes.find((item) => item.id === selection.scopeId)
  const chosenExtras = extras.filter((extra) => selection.extraIds?.includes(extra.id))
  const weeks = quote.weeks === 1 ? '1 semana' : `${quote.weeks} semanas`

  const lines = [`Hola, me interesa ${ARTICLES[type.id]} ${lowerFirst(type.name)} con alcance ${lowerFirst(scope.name)}.`]
  if (chosenExtras.length > 0) lines.push(`Extras: ${chosenExtras.map((extra) => extra.name).join(', ')}.`)
  lines.push(`Plazo: ${selection.isRush ? 'urgente' : 'sin afán'}.`)
  lines.push(`Estimado del cotizador: ${formatCOP(quote.min)} a ${formatCOP(quote.max)}, unas ${weeks}.`)

  return lines.join('\n')
}