import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, MousePointerClick } from 'lucide-react'
import { gsap, reduceMotion, scrollToId } from '../lib/motion'
import { SITE } from '../data'

import FolderSequence from './FolderSequence'

function ProfileCard() {
  const [ok, setOk] = useState(true)
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-paper shadow-[0_20px_50px_-25px_rgba(0,0,0,.35)]">
      <div className="relative h-[46%] min-h-[150px] overflow-hidden rounded-[18px] m-2 bg-[#2C2B29]">
        {ok ? (
          <img src={SITE.photo} alt="The_xxm" onError={() => setOk(false)} className="size-full object-cover" />
        ) : (
          <div className="grain relative grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#5a5550,#2C2B29_70%)]">
            <span className="display text-[64px] text-paper/90">XXM</span>
          </div>
        )}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold">
          <span className="size-1.5 rounded-full bg-[#2BB673]" /> Yangi loyihalarga ochiq
        </span>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <p className="text-[18px] font-semibold leading-tight">The_xxm</p>
        <p className="text-[13px] text-muted">Full-stack dasturchi · o'qituvchi</p>
        <div className="mt-3 flex gap-2 text-[12px]">
          <span className="rounded-full border border-line px-2.5 py-1">14 yoshdan kodda</span>
          <span className="rounded-full border border-line px-2.5 py-1">100+ o'quvchi</span>
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <a href="#aloqa" onClick={(e) => { e.preventDefault(); scrollToId('aloqa') }} className="btn btn-dark !min-h-[44px] w-full">Loyiha boshlash <ArrowRight size={16} /></a>
          <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-line !min-h-[44px] w-full">Telegram</a>
        </div>
      </div>
    </div>
  )
}

export default function Stage() {
  const root = useRef(null)
  const progress = useRef(0)
  const reduced = typeof window !== 'undefined' && reduceMotion()

  useLayoutEffect(() => {
    if (reduced) { progress.current = 1; return }
    const ctx = gsap.context(() => {
      gsap.from('[data-in]', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 })
      gsap.from('[data-hw]', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.07, delay: 0.15 })
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: (s) => { progress.current = s.progress },
        },
      })
      tl.to('[data-hero]', { yPercent: -18, opacity: 0, scale: 0.96, duration: 0.18 }, 0)
        .to('[data-bg]', { scale: 1.12, duration: 1 }, 0)
        .to('[data-veil]', { opacity: 1, duration: 0.14 }, 0.06)
        .fromTo('[data-word]', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.14 }, 0.16)
        .to('[data-word]', { opacity: 0, yPercent: -30, duration: 0.07 }, 0.5)
        .fromTo('[data-cap]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.06 }, 0.88)
        .to({}, { duration: 0.06 }, 0.94)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="top" ref={root} aria-label="Bosh sahifa" className={reduced ? '' : 'relative h-[460svh]'}>
      <div className={`${reduced ? 'relative' : 'sticky top-0'} h-[100svh] overflow-hidden`}>
        <div data-bg className="absolute inset-0 origin-[60%_60%]">
          <picture>
            <source media="(max-width: 767px)" srcSet="/media/tashkent-m.webp" />
            <img src="/media/tashkent.webp" alt="" className="size-full object-cover" fetchPriority="high" />
          </picture>
        </div>
        <div data-veil className="absolute inset-0 bg-paper opacity-0" />

        <div aria-hidden data-word className="pointer-events-none absolute inset-x-0 top-[11svh] select-none text-center opacity-0 md:top-[9svh]">
          <span className="display block text-[min(22vw,19svh)] leading-[0.8] text-ink">Portfolio</span>
        </div>

        {/* Hero oynali kartasi */}
        <div data-hero className="absolute inset-x-0 top-[84px] bottom-6 flex justify-center px-4 md:top-[96px] md:bottom-10 md:px-10">
          <div className="glass relative flex w-full max-w-[1240px] flex-col gap-5 overflow-hidden rounded-[30px] p-3 md:flex-row md:gap-8 md:rounded-[38px] md:p-4">
            <div data-in className="order-2 w-full md:order-1 md:w-[290px] md:shrink-0 max-md:hidden"><ProfileCard /></div>
            <div className="order-1 flex flex-1 flex-col px-3 pt-4 md:order-2 md:px-6 md:pt-8">
              <div data-in className="flex items-center justify-between">
                <span className="eyebrow">Portfolio · 2026</span>
                <span className="hidden items-center gap-2 rounded-full bg-paper/80 px-3 py-1.5 text-[12px] font-semibold md:flex">
                  <span className="size-1.5 rounded-full bg-accent" /> O'zbekiston · masofadan
                </span>
              </div>
              <h1 className="display mt-5 text-[clamp(58px,8.6vw,138px)] md:mt-8">
                {['Biznesingiz', 'uchun', 'dasturlar'].map((w) => (
                  <span key={w} className="block overflow-hidden"><span data-hw className="block">{w}</span></span>
                ))}
              </h1>
              <p data-in className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-ink/75 md:text-[18px]">
                Kassa dasturi, CRM, onlayn menyu va Telegram botlar — do'kon, kafe va firmalar har kuni ishlatadigan tizimlar.
              </p>
              <div data-in className="mt-6 flex flex-wrap gap-2 md:hidden">
                <a href="#aloqa" onClick={(e) => { e.preventDefault(); scrollToId('aloqa') }} className="btn btn-dark">Loyiha boshlash <ArrowRight size={16} /></a>
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-line">Telegram</a>
              </div>
              <p data-in className="mt-auto hidden pb-4 text-[13px] text-muted md:block">Pastga aylantiring — portfolio papkasi ochiladi ↓</p>
            </div>
          </div>
        </div>

        <FolderSequence progressRef={progress} />

        <p data-cap className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-2 text-[14px] font-medium text-ink/80 opacity-0">
          <MousePointerClick size={16} /> Kartani bosing — loyiha haqida batafsil
        </p>
      </div>
    </section>
  )
}
