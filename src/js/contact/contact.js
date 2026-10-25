import { validateContact } from './validate.js'
import { sendContact } from './send.js'
import { buildQuoteMessage } from '../quote/message.js'
import { quoteStore } from '../quote/store.js'

const FIELDS = ['name', 'email', 'phone', 'message']

const ERROR_MESSAGES = {
  'missing-key': 'El formulario todavía no está configurado. Intenta más tarde.',
  rejected: 'El servicio de correo rechazó el envío. Intenta de nuevo en unos minutos.',
  network: 'No pudimos enviar el mensaje. Revisa tu conexión e intenta de nuevo.',
}

export function initContact() {
  const form = document.querySelector('.contact-form')
  const success = document.querySelector('.contact-success')
  if (!form || !success) return

  const field = (name) => form.elements.namedItem(name)
  const status = form.querySelector('.contact-form__status')
  const submit = form.querySelector('[type="submit"]')
  const submitLabel = submit.textContent
  let attempted = false
  let autoMessage = ''

  const readValues = () => Object.fromEntries(FIELDS.map((name) => [name, field(name).value]))

  const showErrors = (errors) => {
    FIELDS.forEach((name) => {
      const message = errors[name] ?? ''
      form.querySelector(`#${name}-error`).textContent = message
      field(name).setAttribute('aria-invalid', String(Boolean(message)))
    })
  }

  const setSending = (sending) => {
    submit.disabled = sending
    submit.textContent = sending ? 'Enviando…' : submitLabel
    form.toggleAttribute('aria-busy', sending)
  }

  // Después del primer intento, los errores se corrigen mientras el usuario escribe.
  form.addEventListener('input', () => {
    if (attempted) showErrors(validateContact(readValues()))
  })

  // "Pedir esta cotización" escribe el mensaje con el estimado,
  // salvo que el usuario ya haya escrito algo propio.
  document.querySelectorAll('[data-quote-cta]').forEach((link) => {
    link.addEventListener('click', () => {
      const messageField = field('message')
      if (messageField.value.trim() && messageField.value !== autoMessage) return
      autoMessage = buildQuoteMessage(quoteStore.get())
      messageField.value = autoMessage
    })
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    attempted = true
    status.textContent = ''

    const values = readValues()
    const errors = validateContact(values)
    showErrors(errors)

    const firstInvalid = FIELDS.find((name) => errors[name])
    if (firstInvalid) {
      field(firstInvalid).focus()
      return
    }

    // Honeypot: un humano nunca marca esta casilla oculta.
    if (field('botcheck').checked) return

    setSending(true)
    const result = await sendContact(
      {
        subject: `Nuevo mensaje de ${values.name.trim()} desde Totumo Studio`,
        from_name: 'Totumo Studio',
        ...values,
      },
      { accessKey: import.meta.env.VITE_WEB3FORMS_KEY },
    )
    setSending(false)

    if (!result.ok) {
      status.textContent = ERROR_MESSAGES[result.error]
      if (result.error === 'missing-key') console.warn('Falta VITE_WEB3FORMS_KEY en .env.local')
      return
    }

    form.reset()
    attempted = false
    autoMessage = ''
    form.hidden = true
    success.hidden = false
    success.focus()
  })

  success.querySelector('button').addEventListener('click', () => {
    success.hidden = true
    form.hidden = false
    field('name').focus()
  })
}