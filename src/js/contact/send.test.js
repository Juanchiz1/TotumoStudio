import { describe, it, expect, vi } from 'vitest'
import { sendContact, ENDPOINT } from './send.js'

const fakeResponse = (ok, body) => ({ ok, json: async () => body })

describe('sendContact', () => {
  it('envía la llave y los campos como JSON', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(true, { success: true }))

    const result = await sendContact({ name: 'Nubia' }, { accessKey: 'abc', fetchImpl })

    expect(result).toEqual({ ok: true })
    const [url, options] = fetchImpl.mock.calls[0]
    expect(url).toBe(ENDPOINT)
    expect(JSON.parse(options.body)).toEqual({ access_key: 'abc', name: 'Nubia' })
  })

  it('reporta cuando el servicio rechaza el envío', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(fakeResponse(false, { success: false, message: 'Invalid key' }))

    const result = await sendContact({}, { accessKey: 'abc', fetchImpl })

    expect(result).toEqual({ ok: false, error: 'rejected', detail: 'Invalid key' })
  })

  it('reporta un error de red sin lanzar excepción', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

    expect(await sendContact({}, { accessKey: 'abc', fetchImpl })).toEqual({ ok: false, error: 'network' })
  })

  it('no hace la petición si falta la llave', async () => {
    const fetchImpl = vi.fn()

    expect(await sendContact({}, { accessKey: '', fetchImpl })).toEqual({ ok: false, error: 'missing-key' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})