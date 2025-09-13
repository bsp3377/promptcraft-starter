# PromptCraft Starter (Vite + React + Tailwind)

This is a minimal starter to convert your Figma design into a working app.

## Quick start

```bash
# 1) Unzip this folder
# 2) Install deps
npm install

# 3) Start dev
npm run dev
```

Open the local URL from the terminal in your browser.

## Where to edit

- `src/pages/Landing.tsx` — the hero section, input card, and minimal layout
- `src/pages/Wizard.tsx` — dynamic questions based on type
- `src/pages/Output.tsx` — final prompt generator

## Tailwind

Edit styles in `src/index.css` and apply utility classes in the TSX files.

## From Figma to Code (simple workflow)

1. **Inspect in Figma**: Use the right sidebar to copy font sizes, spacing, colors.
2. **Export assets**: Select images/icons → Export (PNG/SVG) → save into `src/assets/`.
3. **Translate layers to components**: Sections like header/hero/card become `components` or page sections.
4. **Use flex/grid**: Replicate layout using Tailwind classes (`flex`, `grid`, `gap`, `p-`, `rounded-2xl`, etc.).
5. **Iterate**: Start with structure → add spacing → colors → typography → polish.

## Routing

Uses `react-router-dom`:
- `/` → Landing
- `/wizard` → questions
- `/output` → generated prompt

## Build

```bash
npm run build
npm run preview
```
