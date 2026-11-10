import { useEffect } from 'react'
import Nav from './components/Nav'
import Stage from './components/Stage'
import About from './components/About'
import ProjectList from './components/ProjectList'
import Skills from './components/Skills'
import Process from './components/Process'
import Contact from './components/Contact'
import { startSmoothScroll, ScrollTrigger } from './lib/motion'
import { SITE } from './data'

export default function App() {
  useEffect(() => {
    startSmoothScroll()
    const t = setTimeout(() => ScrollTrigger.refresh(), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Nav />
      <main id="main">
        <Stage />
        <ProjectList />
        <About />
        <Skills />
        <Process />
        <Contact />
      </main>
      <footer className="bg-ink py-12 text-paper">
        <div className="wrap flex flex-col gap-10">
          <p className="display text-[clamp(72px,16vw,260px)] leading-[0.82]">The_xxm</p>
          <div className="flex flex-col justify-between gap-4 border-t border-paper/15 pt-6 text-[14px] text-paper/60 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} The_xxm. Kassa, CRM, saytlar va Telegram botlar.</p>
            <div className="flex gap-6">
              <a className="link-draw hover:text-paper" href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="link-draw hover:text-paper" href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
