export const ENDPOINT = 'https://api.web3forms.com/submit'

/**
 * Envía el formulario a Web3Forms.
 * Nunca lanza excepciones: devuelve { ok: true } o { ok: false, error }.
 * fetchImpl se puede reemplazar en los tests para no hacer peticiones reales.
 */
export async function sendContact(fields, { accessKey, fetchImpl = fetch } = {}) {
  if (!accessKey) return { ok: false, error: 'missing-key' }

  try {
    const response = await fetchImpl(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, ...fields }),
    })
    const data = await response.json().catch(() => ({}))

    if (response.ok && data.success !== false) return { ok: true }
    return { ok: false, error: 'rejected', detail: data.message }
  } catch {
    return { ok: false, error: 'network' }
  }
}