# Grokxhat — Grok Prompt Builder

A beautiful 100% offline prompt builder for **Grok / Flux** and **Midjourney**.

![Grok Prompt Builder](https://github.com/datman1998/Grokxhat/raw/main/index.html)

## Features

- Chip-based interface (subject, style, lighting, camera, colors, mood + **NSFW outfits**)
- Live preview while you build
- Randomize button for surprising combinations
- Two modes: **Flux** (natural sentence) and **Midjourney** (comma tags)
- Ready-made templates in "Tips & Tricks"
- Fully offline after first load
- Pure HTML + CSS + vanilla JS (no dependencies)
- **Bilingual UI** — English by default, Norwegian one click away (auto-detected on first visit)

## Language / Språk

The interface ships in **English** and **Norwegian**. The toggle in the top right
(`EN` / `NO`) switches instantly and is remembered across visits. The *generated*
prompt always stays English since that's what the image models want.

Grensesnittet finnes på **engelsk** og **norsk**. Bryteren oppe til høyre (`EN` / `NO`)
bytter umiddelbart og huskes mellom besøk. Selve prompten holdes alltid på engelsk
fordi det er det bildemodellene vil ha.

## Prompt Studio

A second, more detailed builder lives at **`/prompt-studio.html`** — click the
`STUDIO →` link in the header. It's a React page with:

- Free-text subject + location fields
- Camera, shot, pose, lighting presets
- Style tag chips and detail / stylization / chaos sliders
- Aspect-ratio radio + negative prompt
- Randomize, copy-to-clipboard, and a 5-entry history (persisted in
  `localStorage`)

Like the main builder, the studio is fully client-side — no network calls,
no API keys required.

## Deploy

### Deploy to Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdatman1998%2FGrokxhat)

### GitHub Pages
Go to **Settings → Pages** → Source: `main` / `(root)`

## Run locally

```bash
git clone https://github.com/datman1998/Grokxhat.git
cd Grokxhat
# Open index.html directly in a browser, or:
npx serve .
```

## Usage

1. Pick chips or type in the text field
2. Watch the live preview
3. Click "Build perfect prompt"
4. Copy and paste into Grok Imagine or Midjourney

## NB
This is the **NSFW build** with spicy clothing options (leather, latex, micro bikini,
harness, etc.). Use responsibly.

---

Made with care for creative prompt enthusiasts.

Repo: https://github.com/datman1998/Grokxhat
