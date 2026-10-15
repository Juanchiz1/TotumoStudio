import { projectTypes } from '../data/project-types.js'
import { scopes, extras } from '../data/quote-options.js'

const STORAGE_KEY = 'totumo:quote'

export const DEFAULT_SELECTION = Object.freeze({
  typeId: 'sitio',
  scopeId: 'completo',
  extraIds: [],
  isRush: false,
})

const exists = (list, id) => list.some((item) => item.id === id)

// Todo lo que entra al store pasa por aquí. Lo que venga de localStorage
// puede estar corrupto o ser de una versión vieja del sitio.
export function sanitizeSelection(raw) {
  const value = raw && typeof raw === 'object' ? raw : {}
  const extraIds = Array.isArray(value.extraIds) ? value.extraIds.filter((id) => exists(extras, id)) : []

  return {
    typeId: exists(projectTypes, value.typeId) ? value.typeId : DEFAULT_SELECTION.typeId,
    scopeId: exists(scopes, value.scopeId) ? value.scopeId : DEFAULT_SELECTION.scopeId,
    extraIds: [...new Set(extraIds)],
    isRush: value.isRush === true,
  }
}

// Store mínimo: un estado, quien lo cambie avisa a todos los suscriptores.
export function createStore(initial = DEFAULT_SELECTION) {
  let state = sanitizeSelection(initial)
  const listeners = new Set()

  return {
    get: () => state,
    set(patch) {
      state = sanitizeSelection({ ...state, ...patch })
      listeners.forEach((listener) => listener(state))
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const quoteStore = createStore(loadSaved() ?? DEFAULT_SELECTION)

quoteStore.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Modo privado o almacenamiento lleno: el cotizador sigue funcionando sin guardar.
  }
})