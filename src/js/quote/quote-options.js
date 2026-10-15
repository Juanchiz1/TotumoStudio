// Opciones del cotizador. Los tipos de proyecto están en project-types.js.
export const scopes = [
  { id: 'esencial', name: 'Esencial', description: 'Lo justo para salir al aire.', priceFactor: 1, timeFactor: 1 },
  { id: 'completo', name: 'Completo', description: 'Más secciones y contenido a tu medida.', priceFactor: 1.5, timeFactor: 1.4 },
  { id: 'avanzado', name: 'Avanzado', description: 'Funciones especiales e integraciones.', priceFactor: 2.2, timeFactor: 1.9 },
]

export const extras = [
  { id: 'marca', name: 'Logo e identidad', price: 900000, weeks: 1 },
  { id: 'textos', name: 'Redacción de textos', price: 600000, weeks: 0 },
  { id: 'blog', name: 'Blog editable', price: 700000, weeks: 1 },
  { id: 'pagos', name: 'Pagos en línea', price: 1200000, weeks: 1 },
  { id: 'idiomas', name: 'Español e inglés', price: 800000, weeks: 1 },
  { id: 'seo', name: 'SEO inicial', price: 500000, weeks: 0 },
]

export const deliveryOptions = [
  { id: 'normal', name: 'Sin afán', description: 'Tiempos normales de entrega.' },
  { id: 'urgente', name: 'Lo necesito ya', description: 'Entrega más rápida, con un 25 % adicional.' },
]

// Entrega urgente: 25 % más caro y 30 % más rápido.
export const rush = { priceFactor: 1.25, timeFactor: 0.7 }

// El estimado se muestra como rango: del total al total + 20 %.
export const rangeSpread = 1.2