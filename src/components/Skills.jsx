import { useLayoutEffect, useRef } from 'react'
import {
  siReact, siHtml5, siCss, siJavascript, siJquery, siNodedotjs, siExpress, siNextdotjs,
  siPostgresql, siClaude, siCursor, siTailwindcss, siTelegram, siGit,
} from '../lib/icons'
import { gsap, reduceMotion } from '../lib/motion'

const GROUPS = [
  { t: 'Frontend', d: "Tez ochiladigan, telefonda qulay interfeyslar.", items: [[siReact, 'React'], [siNextdotjs, 'Next.js'], [siHtml5, 'HTML'], [siCss, 'CSS'], [siJavascript, 'JavaScript'], [siJquery, 'jQuery'], [siTailwindcss, 'Tailwind']] },
  { t: 'Backend', d: "API, ma'lumotlar bazasi, to'lov va botlar.", items: [[siNodedotjs, 'Node.js'], [siExpress, 'Express.js'], [siPostgresql, 'PostgreSQL'], [siTelegram, 'Telegram Bot API'], [siGit, 'Git']] },
  { t: "Sun'iy intellekt", d: "AI agentlar bilan ishni bir necha barobar tezlashtiraman.", items: [[siClaude, 'Claude'], [siCursor, 'Cursor'], [null, 'Antigravity']] },
]

function Icon({ icon, size = 22 }) {
  if (!icon) return <span className="grid size-[22px] place-items-center rounded-md bg-ink text-[10px] font-bold text-paper">AG</span>
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill={`#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  )
}

export default function Skills() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-group]', {
        y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '[data-groups]', start: 'top 80%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const all = GROUPS.flatMap((g) => g.items)

  return (
    <section id="konikmalar" ref={root} className="py-24 md:py-32" aria-labelledby="sk-h">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="sk-h" className="display text-[clamp(56px,8vw,128px)]">Ko'nikmalar</h2>
          <p className="max-w-[40ch] text-[16px] leading-relaxed text-ink/70">
            Frontend, backend va sun'iy intellekt. Loyihani boshidan oxirigacha o'zim qilaman: dizayn, interfeys, server, baza va serverga joylash.
          </p>
        </div>

        <div data-groups className="mt-14 grid gap-4 md:grid-cols-3">
          {GROUPS.map((g) => (
            <article key={g.t} data-group className="glass rounded-[26px] p-6 transition-transform duration-300 hover:-translate-y-0.5 md:p-7">
              <h3 className="display text-[40px]">{g.t}</h3>
              <p className="mt-2 text-[15px] text-ink/65">{g.d}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {g.items.map(([ic, name]) => (
                  <li key={name} className="flex min-h-[44px] items-center gap-2.5 rounded-full border border-line bg-paper/80 px-4 text-[15px]">
                    <Icon icon={ic} size={18} />{name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="marquee-wrap mt-16 overflow-hidden border-y border-line py-6" aria-hidden="true">
        <div className="marquee flex w-max gap-12">
          {[...all, ...all].map(([ic, name], i) => (
            <span key={i} className="flex items-center gap-3 display text-[clamp(40px,5vw,72px)] text-ink/85">
              <Icon icon={ic} size={40} />{name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
