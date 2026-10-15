import { describe, it, expect } from 'vitest'
import { formatCOP } from './format.js'


describe('formatMillions', () => {
  it('muestra millones con un decimal y coma', () => {
    expect(formatMillions(4800000)).toBe('4,8')
    expect(formatMillions(16900000)).toBe('16,9')
  })

  it('conserva el decimal aunque sea cero', () => {
    expect(formatMillions(5000000)).toBe('5,0')
  })
})