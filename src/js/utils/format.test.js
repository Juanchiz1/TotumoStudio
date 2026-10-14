import { describe, it, expect } from 'vitest'
import { formatCOP } from './format.js'

describe('formatCOP', () => {
  it('usa punto de miles y sin decimales', () => {
    // Intl separa el signo con un espacio no separable (\u00a0), no con un espacio normal.
    expect(formatCOP(1500000)).toBe('$\u00a01.500.000')
  })

  it('redondea los decimales', () => {
    expect(formatCOP(3300000.4)).toBe('$\u00a03.300.000')
  })
})