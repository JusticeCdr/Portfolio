import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { scrollToId } from '../lib/motion'

const LINKS = [
  ['loyihalar', 'Loyihalar'],
  ['konikmalar', "Ko'nikmalar"],
  ['jarayon', 'Jarayon'],
  ['aloqa', 'Aloqa'],
]

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-[17px] font-bold tracking-tight">
      <img src="/favicon.svg" alt="" width="30" height="30" className="rounded-lg" />
      The_xxm
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (id) => (e) => { e.preventDefault(); setOpen(false); scrollToId(id) }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? 'bg-ground/75 backdrop-blur-md' : ''}`}>
      <div className="wrap flex h-[72px] items-center justify-between">
        <a href="#top" onClick={go('top')} aria-label="The_xxm, bosh sahifa"><Logo /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Asosiy">
          {LINKS.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={go(id)} className="link-draw text-[15px] font-medium text-ink/80 hover:text-ink">{t}</a>
          ))}
          <a href="#aloqa" onClick={go('aloqa')} className="btn btn-dark !min-h-[42px] text-[14px]">Loyiha boshlash</a>
        </nav>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-line bg-paper/70 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div id="mobile-menu" hidden={!open} className="h-[calc(100svh-72px)] bg-ground md:hidden">
        <nav className="wrap flex flex-col gap-2 pt-8" aria-label="Mobil">
          {LINKS.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={go(id)} className="display flex min-h-[64px] items-center border-b border-line text-[44px]">{t}</a>
          ))}
          <a href="#aloqa" onClick={go('aloqa')} className="btn btn-dark mt-8 w-full">Loyiha boshlash</a>
        </nav>
      </div>
    </header>
  )
}
