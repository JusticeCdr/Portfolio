import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, reduceMotion } from '../lib/motion'
import { PROJECTS } from '../data'

function AutoVideo({ src, poster, label }) {
  const v = useRef(null)
  useEffect(() => {
    const el = v.current
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause() }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <video ref={v} src={src} poster={poster} aria-label={label} muted loop playsInline preload="metadata" className="size-full object-cover object-top" />
}

function Phone({ children }) {
  return <div className="relative aspect-[390/844] h-[88%] overflow-hidden rounded-[28px] border-[6px] border-[#151515] bg-black shadow-[0_30px_60px_-25px_rgba(0,0,0,.55)]">{children}</div>
}

function Visual({ p }) {
  if (p.layout === 'desktop') return <img src={p.image} alt={`${p.name} interfeysi`} loading="lazy" className="size-full object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]" />
  return (
    <div className="flex size-full items-center justify-center gap-[5%]" style={{ background: p.ground }}>
      {p.layout === 'phone' && <Phone><img src={p.image} alt={`${p.name} ilovasi`} loading="lazy" className="size-full object-cover" /></Phone>}
      {p.layout === 'video' && (
        <>
          <Phone><AutoVideo src={p.video} poster={p.poster} label={`${p.name} videosi`} /></Phone>
          {p.sidePhone
            ? <div className="h-full max-sm:hidden flex items-center"><Phone><img src={p.side} alt={`${p.name} Telegram boti`} loading="lazy" className="size-full object-cover" /></Phone></div>
            : <img src={p.side} alt={`${p.name} televizordagi menyusi`} loading="lazy" className="w-[52%] rounded-2xl shadow-[0_30px_60px_-25px_rgba(0,0,0,.45)] max-sm:hidden" />}
        </>
      )}
    </div>
  )
}

export default function ProjectList() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-proj]').forEach((el) => {
        gsap.fromTo(el.querySelector('[data-vis]'), { clipPath: 'inset(12% 8% 12% 8% round 28px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 30%', scrub: true },
        })
        gsap.from(el.querySelectorAll('[data-t]'), {
          yPercent: 100, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="loyihalar" ref={root} aria-labelledby="pl-h" className="bg-paper py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-10 md:flex-row md:items-end">
          <h2 id="pl-h" className="display text-[clamp(56px,9vw,150px)]">Loyihalar</h2>
          <p className="max-w-[38ch] text-[16px] leading-relaxed text-ink/70">
            Har biri real biznesda ishlaydi yoki hozir ishga tushirilyapti. Kassa dasturidan Telegram botgacha — hammasini o'zim qilganman.
          </p>
        </div>

        <ol className="mt-6">
          {PROJECTS.map((p, i) => (
            <li key={p.id} id={`p-${p.id}`} data-proj className="group grid scroll-mt-24 gap-8 border-b border-line py-14 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:py-20">
              <div className={`flex flex-col ${i % 2 ? 'md:order-2' : ''}`}>
                <span className="eyebrow">{String(i + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')} · {p.kind}</span>
                <h3 className="display mt-4 overflow-hidden text-[clamp(48px,6.4vw,104px)]"><span data-t className="block">{p.name}</span></h3>
                <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink/75">{p.line}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => <li key={t} className="rounded-full border border-line bg-ground/60 px-3 py-1.5 text-[13px]">{t}</li>)}
                </ul>
                <span className={`mt-8 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold ${p.status === 'Tayyor' ? 'bg-ink text-paper' : 'bg-accent text-white'}`}>
                  <span className="size-1.5 rounded-full bg-current" />{p.status === 'Tayyor' ? 'Ishlamoqda' : 'Hozir ustida ishlayapman'}
                </span>
              </div>
              <div data-vis className="aspect-[16/10] overflow-hidden rounded-[28px] bg-ground max-sm:aspect-[4/5]">
                <Visual p={p} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
