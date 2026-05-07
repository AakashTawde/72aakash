# Cozmaa WhatsApp Chat Solution — Remotion Presentation

A Remotion-based animated video presentation that explains the Cozmaa.com
WhatsApp chat solution to a non-technical client. 18 slides, ~3 min 20 sec at
1920×1080, 30 fps.

## Quick start

```bash
# 1. Install (Node.js 18+ recommended)
npm install

# 2. Live preview in the browser (Remotion Studio)
npm start

# 3. Render the final MP4 (writes to ./out/cozmaa-presentation.mp4)
npm run render
```

The first render takes 2–3 minutes. Subsequent renders are faster because
Remotion caches intermediate frames.

## Where to edit content

Each slide lives in its own file — non-developers can edit text without
touching anything else.

```
src/
├── Root.tsx              # Composition registration (rarely edit)
├── Presentation.tsx      # Slide schedule & per-slide durations
├── theme.ts              # Colors, font, FPS
├── components/           # Reusable building blocks
│   ├── SlideShell.tsx    # Slide title/eyebrow/footer wrapper
│   ├── FadeIn.tsx        # Fade + slide-in animation
│   ├── ChatBubble.tsx    # WhatsApp-style chat bubble
│   ├── PhoneMockup.tsx   # Phone frame with chat header + bubbles
│   ├── FlowDiagram.tsx   # Animated arrow flow
│   └── ComparisonTable.tsx
└── slides/
    ├── Slide01_Title.tsx
    ├── Slide02_Problem.tsx
    ├── ...               # one file per slide, in order
    └── Slide18_NextSteps.tsx
```

### Common edits

| What | Where |
|---|---|
| Change a slide's text | Open the matching `slides/SlideNN_*.tsx` file |
| Make a slide longer/shorter | Edit `seconds` in `src/Presentation.tsx` |
| Reorder slides | Reorder the `SCHEDULE` array in `src/Presentation.tsx` |
| Change brand colors | `src/theme.ts` |
| Replace the logo | Drop a new file at `public/cozmaa-logo.svg` |

### Tips

- After editing, `npm start` hot-reloads instantly.
- All numeric `delay` values in slides are in **frames** (30 frames = 1 second).
- Each slide's "C" logo placeholder in Slide 1 can be swapped with an `<Img>`
  pointing at `staticFile("cozmaa-logo.svg")` once the real logo is provided.

## Audio (optional)

Background music is intentionally not bundled (to avoid copyright). To add it:

1. Drop your `.mp3` into `public/`.
2. Inside `src/Presentation.tsx`, import `Audio` from `remotion` and add:
   ```tsx
   <Audio src={staticFile("bgm.mp3")} volume={0.15} />
   ```
   alongside the `<Sequence>` blocks.

## Render options

```bash
# Render at 4K
npx remotion render Presentation out/cozmaa-4k.mp4 --width=3840 --height=2160

# Render a single slide preview (frames are 30 per second)
npx remotion render Presentation out/preview.mp4 --frames=0-240
```

## Notes for the meeting

- Total runtime: ~3 min 20 sec — leaves room for the speaker to talk over each
  slide.
- Built deliberately conservative on animations: fades and slides only. No 3D,
  no spins, nothing flashy.
- Tone has been kept honest about limitations (Slide 7, Slide 16). Don't trim
  those — they're the slides that build trust.
