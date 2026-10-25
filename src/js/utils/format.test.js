import { describe, it, expect } from 'vitest'
import { formatCOP, formatMillions } from './format.js'

describe('formatCOP', () => {
  it('usa punto de miles y sin decimales', () => {
    // Intl separa el signo con un espacio no separable (\u00a0), no con un espacio normal.
    expect(formatCOP(1500000)).toBe('$\u00a01.500.000')
  })

  it('redondea los decimales', () => {
    expect(formatCOP(3300000.4)).toBe('$\u00a03.300.000')
  })
})

describe('formatMillions', () => {
  it('muestra millones con un decimal y coma', () => {
    expect(formatMillions(4800000)).toBe('4,8')
    expect(formatMillions(16900000)).toBe('16,9')
  })

  it('conserva el decimal aunque sea cero', () => {
    expect(formatMillions(5000000)).toBe('5,0')
  })
})