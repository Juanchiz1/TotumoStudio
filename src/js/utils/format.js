const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const oneDecimal = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const formatCOP = (value) => cop.format(value)

// 4800000 -> "4,8" (para mostrar "$4,8 millones")
export const formatMillions = (value) => oneDecimal.format(value / 1_000_000)