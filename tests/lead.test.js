import { describe, it, expect, beforeEach, vi } from 'vitest'
import { validateLead, formatLead } from '../src/lib/lead.js'
import handler, { resetRateLimit } from '../api/lead.js'

function mockRes() {
  const res = { statusCode: 200, body: null, headers: {} }
  res.status = (c) => { res.statusCode = c; return res }
  res.json = (b) => { res.body = b; return res }
  res.setHeader = (k, v) => { res.headers[k] = v }
  return res
}
const req = (body, method = 'POST', ip = '1.1.1.1') => ({ method, body, headers: { 'x-forwarded-for': ip } })
const env = { TELEGRAM_BOT_TOKEN: 'T', TELEGRAM_CHAT_ID: '42' }
const good = { name: 'Aziz', contact: '+998 90 123 45 67', service: 'Telegram bot', message: 'Kafe uchun bot kerak' }

describe('validateLead', () => {
  it('accepts a phone number', () => expect(validateLead(good).ok).toBe(true))
  it('accepts a telegram username', () => expect(validateLead({ ...good, contact: '@aziz_dev' }).ok).toBe(true))
  it('rejects a missing name', () => expect(validateLead({ ...good, name: ' ' }).errors.name).toBeTruthy())
  it('rejects a bad contact', () => expect(validateLead({ ...good, contact: 'salom!' }).errors.contact).toBeTruthy())
  it('rejects an unknown service', () => expect(validateLead({ ...good, service: 'Hack' }).errors.service).toBeTruthy())
  it('trims long input', () => expect(validateLead({ ...good, message: 'a'.repeat(5000) }).data.message.length).toBe(1000))
})

describe('formatLead', () => {
  it('escapes HTML so users cannot inject markup', () => {
    const t = formatLead({ ...good, name: '<b>x</b>' })
    expect(t).toContain('&lt;b&gt;x&lt;/b&gt;')
    expect(t).not.toContain('<b>x</b>')
  })
})

describe('api/lead handler', () => {
  beforeEach(() => resetRateLimit())

  it('rejects GET with 405', async () => {
    const res = mockRes()
    await handler(req(null, 'GET'), res, { env, fetch: vi.fn() })
    expect(res.statusCode).toBe(405)
  })

  it('returns 400 with field errors for invalid input', async () => {
    const res = mockRes(); const f = vi.fn()
    await handler(req({ name: '', contact: '' }), res, { env, fetch: f })
    expect(res.statusCode).toBe(400)
    expect(res.body.errors.name).toBeTruthy()
    expect(f).not.toHaveBeenCalled()
  })

  it('sends the lead to Telegram and never leaks the token in the response', async () => {
    const res = mockRes(); const f = vi.fn().mockResolvedValue({ ok: true })
    await handler(req(good), res, { env, fetch: f })
    expect(res.statusCode).toBe(200)
    expect(f).toHaveBeenCalledOnce()
    const [url, opts] = f.mock.calls[0]
    expect(url).toBe('https://api.telegram.org/botT/sendMessage')
    expect(JSON.parse(opts.body).chat_id).toBe('42')
    expect(JSON.stringify(res.body)).not.toContain('T/')
  })

  it('silently drops honeypot submissions', async () => {
    const res = mockRes(); const f = vi.fn()
    await handler(req({ ...good, website: 'spam.com' }), res, { env, fetch: f })
    expect(res.statusCode).toBe(200)
    expect(f).not.toHaveBeenCalled()
  })

  it('returns 500 when the bot is not configured', async () => {
    const res = mockRes()
    await handler(req(good), res, { env: {}, fetch: vi.fn() })
    expect(res.statusCode).toBe(500)
  })

  it('returns 502 when Telegram fails', async () => {
    const res = mockRes()
    await handler(req(good), res, { env, fetch: vi.fn().mockResolvedValue({ ok: false, status: 401 }) })
    expect(res.statusCode).toBe(502)
  })

  it('rate-limits after 5 requests from one IP', async () => {
    const f = vi.fn().mockResolvedValue({ ok: true })
    let last
    for (let i = 0; i < 6; i++) { last = mockRes(); await handler(req(good, 'POST', '9.9.9.9'), last, { env, fetch: f }) }
    expect(last.statusCode).toBe(429)
  })

  it('handles a JSON string body and rejects broken JSON', async () => {
    const ok = mockRes(); await handler(req(JSON.stringify(good)), ok, { env, fetch: vi.fn().mockResolvedValue({ ok: true }) })
    expect(ok.statusCode).toBe(200)
    const bad = mockRes(); await handler(req('{oops'), bad, { env, fetch: vi.fn() })
    expect(bad.statusCode).toBe(400)
  })
})
