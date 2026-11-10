// Forma ma'lumotlarini tekshirish — brauzer va server (api/lead.js) bir xil qoidadan foydalanadi.
export const SERVICES = ['Sayt', 'Telegram bot', 'Kassa yoki CRM', 'Onlayn menyu', 'Boshqa']

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)

export function validateLead(input) {
  const data = {
    name: clean(input?.name, 80),
    contact: clean(input?.contact, 80),
    service: clean(input?.service, 40),
    message: clean(input?.message, 1000),
  }
  const errors = {}
  if (data.name.length < 2) errors.name = 'Ismingizni yozing'
  const digits = data.contact.replace(/\D/g, '')
  const isPhone = digits.length >= 9 && digits.length <= 15 && /^[+\d\s()-]+$/.test(data.contact)
  const isTg = /^@?[A-Za-z0-9_]{5,32}$/.test(data.contact)
  if (!isPhone && !isTg) errors.contact = 'Telefon raqam yoki Telegram username yozing'
  if (data.service && !SERVICES.includes(data.service)) errors.service = "Ro'yxatdan tanlang"
  return { ok: Object.keys(errors).length === 0, data, errors }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function formatLead(d) {
  return [
    '🆕 <b>Portfoliodan yangi ariza</b>',
    `👤 <b>Ism:</b> ${esc(d.name)}`,
    `📞 <b>Aloqa:</b> ${esc(d.contact)}`,
    d.service ? `🧩 <b>Xizmat:</b> ${esc(d.service)}` : '',
    d.message ? `💬 <b>Xabar:</b> ${esc(d.message)}` : '',
  ].filter(Boolean).join('\n')
}
