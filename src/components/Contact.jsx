import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { siInstagram, siTelegram } from '../lib/icons'
import { SERVICES, validateLead } from '../lib/lead'
import { SITE } from '../data'

function Brand({ icon }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill={`#${icon.hex}`}><path d={icon.path} /></svg>
}

const field = 'mt-2 w-full rounded-2xl border border-line bg-paper/85 px-4 py-3.5 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink'

export default function Contact() {
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    const v = validateLead(payload)
    setErrors(v.errors)
    if (!v.ok) {
      e.currentTarget.querySelector(`[name="${Object.keys(v.errors)[0]}"]`)?.focus()
      return
    }
    setState('sending')
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.ok) { setErrors(j.errors || {}); throw new Error(j.error || 'Xatolik') }
      setState('sent')
    } catch (err) {
      setMsg(err.message || "Yuborib bo'lmadi")
      setState('error')
    }
  }

  return (
    <section id="aloqa" className="relative overflow-hidden py-24 md:py-36" aria-labelledby="ct-h">
      <img src="/media/tashkent-sm.webp" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 size-full scale-110 object-cover blur-[6px]" />
      <div className="absolute inset-0 bg-ground/45" />
      <div className="wrap relative grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
        <div>
          <h2 id="ct-h" className="display text-[clamp(64px,9vw,150px)]">Loyihangiz<br />bormi?</h2>
          <p className="mt-6 max-w-[40ch] text-[17px] leading-relaxed text-ink/80">
            Ma'lumotingizni qoldiring — ariza to'g'ridan-to'g'ri Telegramimga tushadi va bir kun ichida o'zim bog'lanaman.
          </p>
          <ul className="mt-10 flex flex-col gap-3">
            <li>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="glass group flex min-h-[64px] items-center justify-between rounded-2xl px-5 transition-transform hover:-translate-y-0.5">
                <span className="flex items-center gap-3"><Brand icon={siTelegram} /><span><b className="block text-[16px]">Telegram</b><span className="text-[14px] text-muted">{SITE.telegramHandle}</span></span></span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </li>
            <li>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="glass group flex min-h-[64px] items-center justify-between rounded-2xl px-5 transition-transform hover:-translate-y-0.5">
                <span className="flex items-center gap-3"><Brand icon={siInstagram} /><span><b className="block text-[16px]">Instagram</b><span className="text-[14px] text-muted">{SITE.instagramHandle}</span></span></span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </li>
          </ul>
        </div>

        <div className="glass rounded-[30px] p-6 md:p-9">
          {state === 'sent' ? (
            <div role="status" className="flex min-h-[420px] flex-col items-start justify-center">
              <span className="grid size-14 place-items-center rounded-full bg-ink text-paper"><Check size={28} /></span>
              <h3 className="display mt-6 text-[52px]">Arizangiz yetib keldi</h3>
              <p className="mt-3 max-w-[36ch] text-[16px] text-ink/75">Rahmat! Bir kun ichida siz qoldirgan raqam yoki Telegram orqali bog'lanaman.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-5">
              <div>
                <label htmlFor="f-name" className="text-[14px] font-semibold">Ismingiz</label>
                <input id="f-name" name="name" autoComplete="name" placeholder="Masalan, Aziz" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                {errors.name && <p id="e-name" className="mt-2 text-[14px] font-medium text-[#C2410C]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="f-contact" className="text-[14px] font-semibold">Telefon yoki Telegram</label>
                <input id="f-contact" name="contact" autoComplete="tel" inputMode="text" placeholder="+998 __ ___ __ __ yoki @username" className={field} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'e-contact' : undefined} />
                {errors.contact && <p id="e-contact" className="mt-2 text-[14px] font-medium text-[#C2410C]">{errors.contact}</p>}
              </div>
              <fieldset>
                <legend className="text-[14px] font-semibold">Nima kerak?</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SERVICES.map((s, i) => (
                    <label key={s} className="cursor-pointer">
                      <input type="radio" name="service" value={s} defaultChecked={i === 0} className="peer sr-only" />
                      <span className="flex min-h-[44px] items-center rounded-full border border-line bg-paper/70 px-4 text-[15px] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-accent">{s}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="f-msg" className="text-[14px] font-semibold">Qisqacha loyiha haqida <span className="font-normal text-muted">(ixtiyoriy)</span></label>
                <textarea id="f-msg" name="message" rows={4} placeholder="Masalan: kafe uchun buyurtma boti kerak" className={`${field} resize-none`} />
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
              {state === 'error' && <p role="alert" className="rounded-2xl border border-[#C2410C]/40 bg-[#C2410C]/10 px-4 py-3 text-[14px]">{msg} <a href={SITE.telegram} className="underline">Telegramda yozing</a></p>}
              <button type="submit" disabled={state === 'sending'} className="btn btn-dark mt-2 w-full disabled:opacity-60">
                {state === 'sending' ? 'Yuborilmoqda…' : <>Arizani yuborish <ArrowRight size={18} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
