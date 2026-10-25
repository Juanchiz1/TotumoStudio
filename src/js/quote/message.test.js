import { describe, it, expect } from 'vitest'
import { buildQuoteMessage } from './message.js'

// formatCOP usa un espacio no separable entre el signo y el número.
const cop = (text) => text.replaceAll('$ ', '$\u00a0')

describe('buildQuoteMessage', () => {
  it('describe un sitio corporativo sin extras', () => {
    const message = buildQuoteMessage({ typeId: 'sitio', scopeId: 'completo', extraIds: [], isRush: false })

    expect(message).toBe(
      cop(
        [
          'Hola, me interesa un sitio corporativo con alcance completo.',
          'Plazo: sin afán.',
          'Estimado del cotizador: $ 4.800.000 a $ 5.800.000, unas 6 semanas.',
        ].join('\n'),
      ),
    )
  })

  it('incluye los extras y el plazo urgente', () => {
    const message = buildQuoteMessage({ typeId: 'tienda', scopeId: 'completo', extraIds: ['pagos', 'seo'], isRush: true })

    expect(message).toContain('Hola, me interesa una tienda online con alcance completo.')
    expect(message).toContain('Extras: Pagos en línea, SEO inicial.')
    expect(message).toContain('Plazo: urgente.')
    expect(message).toContain(cop('$ 12.400.000 a $ 14.900.000, unas 7 semanas.'))
  })
})