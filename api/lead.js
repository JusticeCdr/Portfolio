// Vercel serverless funksiya: formadan kelgan arizani Telegram botga yuboradi.
// Token va chat ID faqat Vercel Environment Variables'da saqlanadi (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID).
import { validateLead, formatLead } from '../src/lib/lead.js'

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

export function rateLimited(ip, now = Date.now()) {
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  return list.length > MAX_PER_WINDOW
}

export function resetRateLimit() { hits.clear() }

export default async function handler(req, res, deps = {}) {
  const send = deps.fetch || fetch
  const env = deps.env || process.env

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Faqat POST' })
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: "Juda ko'p urinish. Birozdan keyin qayta yuboring." })

  let body = req.body
  if (typeof body === 'string') {
    if (body.length > 5000) return res.status(413).json({ ok: false, error: 'Xabar juda uzun' })
    try { body = JSON.parse(body) } catch { return res.status(400).json({ ok: false, error: "Noto'g'ri so'rov" }) }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, error: "Noto'g'ri so'rov" })

  // Bot-spam tuzog'i: yashirin maydon to'ldirilgan bo'lsa, jim qabul qilamiz.
  if (body.website) return res.status(200).json({ ok: true })

  const { ok, data, errors } = validateLead(body)
  if (!ok) return res.status(400).json({ ok: false, errors })

  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('lead: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan')
    return res.status(500).json({ ok: false, error: "Hozir yuborib bo'lmadi. Telegram orqali yozing." })
  }

  try {
    const r = await send(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: formatLead(data), parse_mode: 'HTML', disable_web_page_preview: true }),
    })
    if (!r.ok) throw new Error(`telegram ${r.status}`)
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('lead: telegram xatosi', e.message)
    return res.status(502).json({ ok: false, error: "Hozir yuborib bo'lmadi. Telegram orqali yozing." })
  }
}
