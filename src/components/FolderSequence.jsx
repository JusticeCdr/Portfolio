import { useEffect, useRef } from 'react'
import { PROJECTS } from '../data'
import { scrollToId } from '../lib/motion'

// AI (FLUX Krea + Wan 2.2) bilan yaratilgan papka ochilish videosining 16 kadri scroll bilan aylantiriladi.
// Oxirida videodagi 6 ta oq karta haqiqiy loyiha kartalariga aylanib, to'rga teriladi.

const N = 16
const FW = 832, FH = 480
// so'nggi kadrdagi oq kartalar: markaz x, y, burchak (kadr pikselida)
const ARC = [[246, 158, -27], [304, 119, -16], [372, 95, -6], [446, 92, 5], [513, 110, 15], [575, 150, 27]]
const ARC_W = 70, ARC_H = 92

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const lerp = (a, b, t) => a + (b - a) * t

export default function FolderSequence({ progressRef }) {
  const canvasRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const frames = Array.from({ length: N }, (_, i) => {
      const im = new Image()
      im.decoding = 'async'
      im.src = `/media/seq/f${String(i).padStart(2, '0')}.webp`
      return im
    })
    let top = 'rgb(192,188,182)', bot = 'rgb(221,220,215)'
    frames[0].onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = FW; c.height = FH
        const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(frames[0], 0, 0)
        const avg = (y) => { const d = g.getImageData(0, y, FW, 4).data; let r = 0, gg = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2] } const n = d.length / 4; return `rgb(${r / n | 0},${gg / n | 0},${b / n | 0})` }
        top = avg(0); bot = avg(FH - 4)
      } catch { /* default ranglar */ }
    }

    let W = 0, H = 0, dpr = 1, scale = 1, ox = 0, oy = 0
    const size = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width; H = r.height
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      const portrait = W / H < 1
      // kompyuterda ekranni to'ldiradi, telefonda papka to'liq ko'rinadigan qilib eniga moslanadi
      scale = portrait ? (W / (FW * 0.86)) : Math.max(W / FW, H / FH)
      ox = (W - FW * scale) / 2 + (portrait ? -FW * 0.005 * scale : 0)
      oy = (H - FH * scale) / 2 + (portrait ? -H * 0.04 : 0)
      layoutCards()
    }

    const finals = []
    function layoutCards() {
      const mobile = W < 768
      const cols = mobile ? 2 : 3
      const cw = mobile ? Math.min(W * 0.44, 220) : Math.min(W * 0.25, 360)
      const ch = cw * 720 / 1024
      const gx = cw + (mobile ? 10 : 24), gy = ch + (mobile ? 12 : 26)
      const rows = Math.ceil(PROJECTS.length / cols)
      PROJECTS.forEach((_, i) => {
        const c = i % cols, r = Math.floor(i / cols)
        finals[i] = {
          x: W / 2 + (c - (cols - 1) / 2) * gx,
          y: H / 2 + (r - (rows - 1) / 2) * gy + (mobile ? 10 : 30),
          rot: (c - (cols - 1) / 2) * (mobile ? 1.5 : 2.5),
          w: cw, h: ch,
        }
        const el = cardsRef.current[i]
        if (el) { el.style.width = `${cw}px`; el.style.height = `${ch}px` }
      })
    }

    const ro = new ResizeObserver(size)
    ro.observe(canvas)
    size()

    let p = progressRef.current, raf, last = -1
    const draw = () => {
      raf = requestAnimationFrame(draw)
      p += (progressRef.current - p) * 0.14
      if (Math.abs(p - last) < 0.0004 && last >= 0) return
      last = p

      // 1) kadrlar
      const f = seg(p, 0.2, 0.74) * (N - 1)
      const i0 = Math.floor(f), i1 = Math.min(N - 1, i0 + 1), t = f - i0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, top); grad.addColorStop(1, bot)
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)
      const a = frames[i0], b = frames[i1]
      ctx.imageSmoothingQuality = 'high'
      if (a.complete && a.naturalWidth) { ctx.globalAlpha = 1; ctx.drawImage(a, ox, oy, FW * scale, FH * scale) }
      if (t > 0.01 && b.complete && b.naturalWidth) { ctx.globalAlpha = t; ctx.drawImage(b, ox, oy, FW * scale, FH * scale) }
      ctx.globalAlpha = 1
      // telefonda kadrdan tashqaridagi joyni kadrning chekka qatorlarini cho'zib to'ldiramiz
      if (oy > 0) {
        const src = t > 0.5 && b.complete && b.naturalWidth ? b : a
        if (src.complete && src.naturalWidth) {
          ctx.drawImage(src, 0, 2, FW, 2, ox, 0, FW * scale, oy + 1)
          const yb = oy + FH * scale
          ctx.drawImage(src, 0, FH - 4, FW, 2, ox, yb - 1, FW * scale, H - yb + 2)
          // ulanish joyini yumshatish
          const fh = FH * scale * 0.06
          ctx.globalAlpha = 0.6
          ctx.drawImage(src, 0, 2, FW, 2, ox, oy, FW * scale, fh)
          ctx.drawImage(src, 0, FH - 4, FW, 2, ox, yb - fh, FW * scale, fh)
          ctx.globalAlpha = 1
        }
      }

      // 2) kartalar
      const show = seg(p, 0.76, 0.82)
      const fly = ease(seg(p, 0.82, 0.97))
      PROJECTS.forEach((_, i) => {
        const el = cardsRef.current[i]; const fin = finals[i]
        if (!el || !fin) return
        const [ax, ay, ar] = ARC[i]
        const sx = ox + ax * scale, sy = oy + ay * scale
        const x = lerp(sx, fin.x, fly), y = lerp(sy, fin.y, fly)
        const scX = lerp((ARC_W * scale) / fin.w, 1, fly)
        const scY = lerp((ARC_H * scale) / fin.h, 1, fly)
        const rot = lerp(ar, fin.rot, fly)
        el.style.transform = `translate(${x - fin.w / 2}px, ${y - fin.h / 2}px) rotate(${rot}deg) scale(${scX}, ${scY})`
        el.style.opacity = String(show)
        el.style.pointerEvents = fly > 0.95 ? 'auto' : 'none'
        const btn = el.firstChild
        if (btn) btn.style.opacity = String(seg(fly, 0.25, 0.75))
      })
      canvas.style.opacity = String(seg(p, 0.12, 0.22) * lerp(1, 0.35, fly))
    }
    draw()

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [progressRef])

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full opacity-0 mix-blend-multiply" />
      <ul aria-label="Loyihalar" className="pointer-events-none absolute inset-0">
        {PROJECTS.map((pr, i) => (
          <li key={pr.id} ref={(el) => { cardsRef.current[i] = el }} className="absolute left-0 top-0 origin-center overflow-hidden rounded-[10px] bg-white opacity-0 shadow-[0_24px_50px_-20px_rgba(0,0,0,.45)] will-change-transform">
            <button
              type="button"
              onClick={() => scrollToId(`p-${pr.id}`)}
              aria-label={`${pr.name} — batafsil`}
              className="group block size-full opacity-0"
            >
              <img src={`/media/card-${pr.id}.webp`} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
