# Lumière — Laser Hair Removal Motion Landing Page

A self-contained, motion-rich landing page for a premium laser hair removal
clinic. Built with vanilla HTML, Tailwind CSS (CDN) and a small motion layer
in vanilla JS — no build step required.

## Run it

```bash
# Any static server works. From this folder:
python3 -m http.server 5173
# or
npx serve .
```

Then open http://localhost:5173.

## What's animated

- Hero headline reveals line-by-line on load
- Floating treatment card with parallax tilt on hover
- Animated laser glow + scan line + progress bar
- IntersectionObserver-driven section reveals with staggered children
- Number counters that animate on enter
- Custom cursor (dot + lagging ring) that grows on interactive elements
- Marquee strip of treatment areas
- Science cards with a mouse-tracking spotlight
- FAQ accordion with rotating "+" indicator
- Sticky nav that frosts on scroll
- Honors `prefers-reduced-motion`

## Files

- `index.html` — markup + Tailwind config
- `styles.css` — keyframes, custom cursor, reveal classes
- `script.js` — IntersectionObserver, counter, cursor, parallax, form handler
