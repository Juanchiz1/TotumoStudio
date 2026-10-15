import { describe, it, expect, vi } from 'vitest'
import { createStore, sanitizeSelection, DEFAULT_SELECTION } from './store.js'

describe('sanitizeSelection', () => {
  it('devuelve la selección por defecto si recibe basura', () => {
    expect(sanitizeSelection(null)).toEqual(DEFAULT_SELECTION)
    expect(sanitizeSelection('hola')).toEqual(DEFAULT_SELECTION)
  })

  it('descarta ids que no existen y extras repetidos', () => {
    const clean = sanitizeSelection({
      typeId: 'tienda',
      scopeId: 'enorme',
      extraIds: ['seo', 'nft', 'seo'],
      isRush: 'sí',
    })

    expect(clean).toEqual({ typeId: 'tienda', scopeId: 'completo', extraIds: ['seo'], isRush: false })
  })
})

describe('createStore', () => {
  it('avisa a los suscriptores con el estado nuevo', () => {
    const store = createStore()
    const listener = vi.fn()
    store.subscribe(listener)

    store.set({ typeId: 'app' })

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ typeId: 'app', scopeId: 'completo' }))
    expect(store.get().typeId).toBe('app')
  })

  it('deja de avisar después de cancelar la suscripción', () => {
    const store = createStore()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    unsubscribe()
    store.set({ isRush: true })

    expect(listener).not.toHaveBeenCalled()
  })
})