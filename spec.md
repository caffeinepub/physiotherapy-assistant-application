# PhysioAssist – Clinical AI for Physiotherapy

## Current State
The app has a basic landing page (`LandingPage` in `App.tsx`) with a simple hero section featuring a logo badge, headline, 4 small feature pills, and a single login CTA button. It lacks immersive 3D visuals, full feature sections, posture demo mockup, dashboard preview, or animations. The design system is already configured for dark, deep navy/teal palette with glassmorphism utilities in `index.css`.

## Requested Changes (Diff)

### Add
- Full-page immersive landing page with multiple sections (hero, features, posture demo, dashboard preview, stats, footer CTA)
- Animated particle/neural network canvas background in hero
- React Three Fiber 3D skeleton model (rotating, floating) in hero
- 4 glassmorphism feature cards with icons, SVG illustrations, hover lift, scroll-reveal animations
- Posture Analysis demo section: human silhouette, scanning beam, joint dots, AI results panel
- Dashboard preview section: recharts LineChart, progress bars, AI insights cards
- Smooth scroll-reveal for all sections (IntersectionObserver)
- Glowing button effects, card hover lifts
- Stats row with animated counters
- Full footer with disclaimer text, links, and branding
- "Try Demo" secondary button alongside "Access Dashboard"
- Separate `LandingPage.tsx` component file extracted from App.tsx

### Modify
- `App.tsx`: replace inline `LandingPage` function with imported `LandingPage` component
- `Footer.tsx`: expand to full multi-column footer with disclaimer, links, and legal notice
- `Header.tsx`: add nav links visible on landing page (Features, Demo)
- `index.css`: add scroll-reveal keyframes, scanning beam animation, joint pulse animation

### Remove
- Nothing removed — existing dashboard and auth flows stay intact

## Implementation Plan
1. Add scroll-reveal CSS keyframes and scanning/pulse animations to `index.css`
2. Create `src/pages/LandingPage.tsx` with all sections:
   - HeroSection: particle canvas, Three.js skeleton, headline, two CTAs
   - FeaturesSection: 4 scroll-reveal glassmorphism cards with SVG illustrations
   - PostureDemoSection: scanning mockup with joint highlights and AI panel
   - DashboardPreviewSection: recharts line chart and metric cards
   - StatsSection: animated counter tiles
   - LandingFooter: full disclaimer and links
3. Update `App.tsx` to import and use `LandingPage`
4. Update `Footer.tsx` to show compact disclaimer in app, full disclaimer on landing
5. Ensure no raw color literals — all styling via OKLCH tokens or documented literals for canvas
