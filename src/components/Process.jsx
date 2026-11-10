import { useLayoutEffect, useRef } from 'react'
import { gsap, reduceMotion } from '../lib/motion'
import { STEPS } from '../data'

export default function Process() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-progress]', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '[data-steps]', start: 'top 60%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray('[data-step]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0.28 }, {
          opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 50%', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="jarayon" ref={root} className="bg-paper py-24 md:py-36" aria-labelledby="pc-h">
      <div className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <span className="eyebrow">Mijozlar bilan ishlash</span>
          <h2 id="pc-h" className="display mt-4 text-[clamp(56px,7.4vw,120px)]">Qanday<br />ishlayman</h2>
          <p className="mt-6 max-w-[38ch] text-[16px] leading-relaxed text-ink/70">
            To'rt qadam. Har qadamda nima bo'layotganini ko'rib turasiz va pul aniq natija uchun to'lanadi.
          </p>
        </div>
        <ol data-steps className="relative border-l border-line pl-8 md:pl-12">
          <span data-progress aria-hidden className="absolute -left-px top-0 h-full w-px origin-top bg-ink" />
          {STEPS.map((s) => (
            <li key={s.n} data-step className="relative pb-14 last:pb-0 md:pb-20">
              <span aria-hidden className="absolute -left-[37px] top-2 size-[9px] rounded-full bg-ink md:-left-[53px]" />
              <span className="eyebrow">{s.n}</span>
              <h3 className="display mt-2 text-[clamp(44px,4.6vw,72px)]">{s.t}</h3>
              <p className="mt-3 max-w-[44ch] text-[17px] leading-relaxed text-ink/75">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
