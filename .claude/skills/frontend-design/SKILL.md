---
name: frontend-design
description: Distinctive, intentional visual design for shadcn/ui + Tailwind CSS + Framer Motion (motion/react) pages in this repo. Covers typography pairing, color and spacing systems, and avoiding generic/templated "AI-startup" layouts. Apply this whenever writing or editing a page, section component, or the showcase page (app/page.tsx) — anything with visible UI.
---

# Frontend Design

This repo's UI is judged on whether it looks *designed* or *assembled*. shadcn/ui + Tailwind makes it trivially easy to ship a page that is functionally correct and visually generic — evenly-spaced cards, a centered hero, a muted-gray-on-white palette, Inter or Geist at default weights. That's the failure mode this skill exists to prevent.

## Typography

- **Never ship on system fonts or a single default font for everything.** Pair a display font (headlines, hero text, section titles) with a distinct body/UI font. This repo already loads `Geist` (sans) and `Geist Mono` via `next/font/google` in [app/layout.tsx](../../../app/layout.tsx) as the body/UI faces — use `font-sans` / `font-mono` for body copy, labels, and code.
- For display type (h1 hero wordmark, big section headers), don't just reuse `font-sans` at a bigger size — that's the "assembled" tell. Pull in one deliberate display face (e.g. a warm editorial serif like Fraunces or Instrument Serif, or a condensed grotesk) via `next/font/google`, register it as a `--font-display` CSS variable next to the existing font variables in `app/layout.tsx`, and reserve it for moments that should feel like a statement, not for every heading.
- Set real tracking/leading per size — tight tracking on large display text (`tracking-tight` or tighter), relaxed leading on body paragraphs (`leading-relaxed`). Default browser line-height on long-form text reads as unfinished.

## Color & Spacing Systems

- Work from the CSS variables shadcn's `init` already wrote into `app/globals.css` (the `@theme inline` block) — extend that palette deliberately rather than reaching for raw Tailwind grays (`gray-100`, `zinc-500`, etc.) inline. A page that mixes shadcn theme tokens with ad-hoc Tailwind grays looks stitched together.
- Pick one accent hue with intent (tied to the product, not "Tailwind blue-500 because it was the default") and use it sparingly — for the one or two elements per section that should draw the eye, not on every button and badge.
- Spacing should read as a scale, not arbitrary values. Prefer the Tailwind spacing scale consistently (e.g. always step in `4`/`6`/`8`/`12`/`16`/`24` for section padding) so rhythm is consistent top-to-bottom. Generous whitespace between sections (`py-24`/`py-32` at the section level) reads as confident; cramped `py-8` everywhere reads as a template.

## Avoiding Generic Layouts

Templated "AI-startup" tells to actively avoid:
- A hero that is: centered wordmark, centered one-line tagline, two pill buttons, done. If you use this shape, break it somewhere — asymmetry, an off-center visual element, a display-font word that overlaps the fold, anything that signals a specific choice was made.
- Feature grids where every card has the same icon-title-paragraph structure repeated verbatim. Vary emphasis: make one card larger, give one a different visual treatment, or break the grid rhythm intentionally.
- Overuse of `rounded-2xl` + drop shadow + white card on gray background for *everything*. Vary surface treatment by section so the page doesn't read as one repeated component.

## Framer Motion (motion/react)

- Motion should read as restraint, not spectacle. Default pattern: fade + slight upward slide on scroll into view (`initial={{ opacity: 0, y: 16 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`), staggered slightly across siblings in a grid via `transition={{ delay: i * 0.05 }}`.
- Avoid infinite/looping animations outside of one clearly-intentional hero accent (e.g. a slow gradient drift). Constant motion elsewhere reads as distracting, not polished.
- Hover/tap micro-interactions on interactive elements (buttons, cards) should be quick (150–250ms) and subtle (scale `0.98`–`1.02`, not larger).

## Process

1. Before writing markup for a new section, decide the one thing that should look deliberate (an asymmetric layout, a typography moment, a specific motion beat) — don't start from "grid of cards" by default.
2. Build with the theme tokens and font variables already established in this repo (`app/globals.css`, `app/layout.tsx`) rather than introducing new ad-hoc values per component.
3. When in doubt, under-decorate rather than over-decorate — the failure mode of "too generic" is far more common in agent output than "too much."
