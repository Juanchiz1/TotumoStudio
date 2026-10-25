const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^[+\d\s()-]{7,20}$/

/**
 * Valida los campos del formulario de contacto.
 * Devuelve un objeto con un mensaje por cada campo inválido; vacío si todo está bien.
 */
export function validateContact({ name = '', email = '', phone = '', message = '' }) {
  const errors = {}

  if (name.trim().length < 2) errors.name = 'Escribe tu nombre.'
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Revisa el correo, parece incompleto.'
  if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) errors.phone = 'Usa solo números, espacios, guiones o +.'
  if (message.trim().length < 10) errors.message = 'Cuéntanos al menos en una línea qué necesitas.'

  return errors
}