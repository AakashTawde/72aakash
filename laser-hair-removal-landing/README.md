# Cozmaa Laser — Motion Landing Page

A motion-rich landing page for Cozmaa Laser hair removal.

**Brand:** colours and fonts pulled from
`cozmaa-whatsapp-presentation/src/theme.ts` — teal `#0A7E8C`, gold `#D4A843`,
navy `#1B2D4F`, off-white `#F7FAFB`, fonts Inter + Poppins.

**Stack:** vanilla HTML + CSS + JS, GSAP 3.12 + ScrollTrigger via CDN. No
build step.

## Run

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Motion inventory

- Animated preloader with progress bar + brand mark
- Custom cursor (dot + lagging ring) with magnetic buttons
- Hero intro: word-by-word stagger reveal, eyebrow + sub fade, device card
  scale-in, chip back-out, full timeline orchestrated with GSAP
- 3D hero device: mouse-tilt + scroll parallax with `transformPerspective`
- Animated SVG laser paths drawing across hero
- Scroll parallax on orbs, grid floor, and hero content
- GSAP infinite marquee strip (hardware-accelerated)
- **Pinned horizontal scroll** for the Science section (4 panels)
- ScrollTrigger-driven text-mask reveals on every section heading
- Process timeline: per-step entrance + dot pop with `back.out`
- Number counters that tween on enter
- Animated SVG circle-progress (90% reduction stat)
- Before/After cards with scrub-driven divider sweep
- 3D card tilt on hover (pricing, results, hero)
- FAQ accordion with rotating + → × indicator
- Smooth GSAP scroll on anchor links
- Frosted nav on scroll
- Reduced-motion respected throughout

## Files

- `index.html` — markup
- `styles.css` — full design system, keyframes, layout
- `script.js` — GSAP timelines, ScrollTrigger setups, magnetic cursor
