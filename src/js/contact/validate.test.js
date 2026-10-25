import { describe, it, expect } from 'vitest'
import { validateContact } from './validate.js'

const valid = {
  name: 'Nubia Pérez',
  email: 'nubia@correo.com',
  phone: '',
  message: 'Quiero vender mis panes por internet.',
}

describe('validateContact', () => {
  it('no devuelve errores si todo está bien', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('el teléfono es opcional, pero si viene debe ser válido', () => {
    expect(validateContact({ ...valid, phone: '+57 300 123 4567' })).toEqual({})
    expect(validateContact({ ...valid, phone: 'llámame' })).toHaveProperty('phone')
  })

  it('marca cada campo obligatorio que falta', () => {
    const errors = validateContact({ name: ' ', email: 'nubia@', message: 'hola' })

    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('ignora espacios al inicio y al final', () => {
    expect(validateContact({ ...valid, email: '  nubia@correo.com  ' })).toEqual({})
  })
})