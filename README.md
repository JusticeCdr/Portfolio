# The_xxm — portfolio

Animatsion portfolio sayti: React + Vite + Tailwind, GSAP ScrollTrigger, Lenis, Three.js va Motion.
Loyihalar bo'limi 21st.dev'dagi "Scroll Stacking Cards" komponenti asosida qilingan.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # forma va API testlari
npm run build
```

## Tahrirlash

- Matnlar, loyihalar, Telegram/Instagram havolalari: `src/data.js`
- Rasmingiz: `public/media/me.jpg` (4:5 nisbatda)
- Loyiha rasmlari va videolari: `public/media/`

## Forma → Telegram bot

Forma `/api/lead` (Vercel serverless funksiya) orqali arizani Telegram botga yuboradi.
Vercel → Project → Settings → Environment Variables'ga qo'shing:

| Nomi | Qiymati |
|---|---|
| `TELEGRAM_BOT_TOKEN` | @BotFather bergan token |
| `TELEGRAM_CHAT_ID` | arizalar tushadigan chat ID (o'zingiz yoki guruh) |

Tokenni hech qachon kodga yoki GitHub'ga yozmang.

## Vizuallar

- Toshkent tumanli manzarasi (`public/media/tashkent*.webp`) — Z-Image Turbo (Hugging Face) bilan yaratilgan.
- Papka ochilish animatsiyasi (`public/media/seq/`) — FLUX.1 Krea bilan boshlanish va tugash kadrlari, Wan 2.2 (first-last frame) bilan video, undan 16 kadr olingan. Scroll bilan `<canvas>`da aylantiriladi.
