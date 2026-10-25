import { describe, it, expect } from 'vitest'
import { calculateQuote } from './pricing.js'
import { projectTypes } from '../data/project-types.js'
import { scopes } from '../data/quote-options.js'

describe('calculateQuote', () => {
  it('calcula un sitio corporativo completo sin extras', () => {
    const quote = calculateQuote({ typeId: 'sitio', scopeId: 'completo' })

    expect(quote.min).toBe(4800000)
    expect(quote.max).toBe(5800000)
    expect(quote.weeks).toBe(6)
    expect(quote.lines).toEqual([{ label: 'Sitio corporativo · Completo', amount: 4800000 }])
  })

  it('suma el precio y las semanas de cada extra', () => {
    const quote = calculateQuote({ typeId: 'landing', scopeId: 'esencial', extraIds: ['marca', 'seo'] })

    expect(quote.min).toBe(2900000)
    expect(quote.weeks).toBe(3)
    expect(quote.lines.map((line) => line.label)).toEqual([
      'Landing page · Esencial',
      'Logo e identidad',
      'SEO inicial',
    ])
  })

  it('cuenta una sola vez un extra repetido', () => {
    const once = calculateQuote({ typeId: 'tienda', scopeId: 'esencial', extraIds: ['pagos'] })
    const twice = calculateQuote({ typeId: 'tienda', scopeId: 'esencial', extraIds: ['pagos', 'pagos'] })

    expect(twice).toEqual(once)
  })

  it('la entrega urgente cuesta 25 % más y toma menos semanas', () => {
    const normal = calculateQuote({ typeId: 'app', scopeId: 'completo' })
    const urgent = calculateQuote({ typeId: 'app', scopeId: 'completo', isRush: true })

    expect(urgent.min).toBe(16900000)
    expect(urgent.weeks).toBeLessThan(normal.weeks)
    expect(urgent.lines.at(-1)).toEqual({ label: 'Entrega urgente', amount: 3375000 })
  })

  it('redondea el rango a múltiplos de 100.000', () => {
    const quote = calculateQuote({ typeId: 'landing', scopeId: 'avanzado', extraIds: ['textos'], isRush: true })

    expect(quote.min % 100000).toBe(0)
    expect(quote.max % 100000).toBe(0)
  })

  it('siempre devuelve un rango válido y al menos una semana', () => {
    for (const type of projectTypes) {
      for (const scope of scopes) {
        for (const isRush of [false, true]) {
          const quote = calculateQuote({ typeId: type.id, scopeId: scope.id, isRush })

          expect(quote.max).toBeGreaterThan(quote.min)
          expect(quote.weeks).toBeGreaterThanOrEqual(1)
        }
      }
    }
  })

  it('rechaza opciones que no existen', () => {
    expect(() => calculateQuote({ typeId: 'blog', scopeId: 'completo' })).toThrow('Tipo de proyecto desconocido')
    expect(() => calculateQuote({ typeId: 'sitio', scopeId: 'gigante' })).toThrow('Alcance desconocido')
    expect(() => calculateQuote({ typeId: 'sitio', scopeId: 'completo', extraIds: ['nft'] })).toThrow(
      'Extra desconocido',
    )
  })
})