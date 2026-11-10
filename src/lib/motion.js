import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis
export function startSmoothScroll() {
  if (lenis || reduceMotion()) return lenis
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -10 })
  else el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' })
}

export { gsap, ScrollTrigger }
