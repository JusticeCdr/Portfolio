import { useLayoutEffect, useRef } from 'react'
import { gsap, reduceMotion } from '../lib/motion'

const STATEMENT =
  "Men biznes egalari har kuni ishlatadigan dasturlar qilaman: kassada savdo, omborda qoldiq, telefonda buyurtma. Chiroyli ko'rinish yetarli emas — dastur pul va vaqtni tejashi kerak."

const STATS = [
  { v: 14, s: '', l: "yoshimdan beri dasturlash bilan shug'ullanaman" },
  { v: 100, s: '+', l: "o'quvchiga frontend va backendni o'rgatganman" },
  { v: 6, s: '', l: "real biznes uchun loyiha: kassa, CRM, menyu, bot" },
]

export default function About() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.to('.word', {
        color: '#1C1B1A', stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '[data-statement]', start: 'top 78%', end: 'bottom 50%', scrub: true },
      })
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const o = { v: 0 }
        gsap.to(o, {
          v: Number(el.dataset.count), duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => { el.textContent = Math.round(o.v) },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="men" ref={root} aria-labelledby="men-h" className="py-24 md:py-36">
      <div className="wrap">
        <h2 id="men-h" className="eyebrow">Men haqimda</h2>
        <p data-statement className="mt-8 max-w-[30ch] text-[clamp(28px,3.8vw,54px)] font-semibold leading-[1.12] tracking-[-0.03em]">
          {STATEMENT.split(' ').map((w, i) => <span key={i} className="word">{w} </span>)}
        </p>
        <dl className="mt-20 grid gap-4 md:mt-28 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.l} className="glass rounded-[26px] p-7">
              <dt className="sr-only">{s.l}</dt>
              <dd className="display text-[clamp(84px,9vw,140px)]"><span data-count={s.v}>{s.v}</span>{s.s}</dd>
              <dd className="mt-4 max-w-[26ch] text-[16px] leading-snug text-ink/75">{s.l}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 max-w-[60ch] text-[17px] leading-relaxed text-ink/70">
          Bir yildan beri dasturlashdan dars beraman. O'quvchilarimga ham, mijozlarimga ham bir xil narsani o'rgataman: avval
          muammoni tushun, keyin kod yoz. Har bir loyihada sun'iy intellekt vositalaridan foydalanaman — shuning uchun ish tezroq
          va arzonroq chiqadi.
        </p>
      </div>
    </section>
  )
}
