# PhysioAssist – Login Fix & Inner UI Performance

## Current State
- Internet Identity is the auth mechanism. "Access Dashboard" opens the II popup.
- After login, users with no profile see `ProfileSetupModal`. After setup, users with "guest" role see `AccessRestrictedScreen` with invite-code input.
- `Header.tsx` `handleAuth` uses `await login()` / `await clear()` — but `login()` does not return a Promise; it calls `authClient.login()` which triggers a redirect/popup and resolves via callbacks. Awaiting it causes a misleading "User is already authenticated" error path on the second click.
- Landing page loads 3 heavy concurrent systems: `ParticleCanvas` (110 nodes, 60fps canvas), `SkeletonScene` (Three.js WebGLRenderer, dynamic import), aurora-bg CSS animation, multiple IntersectionObserver scroll reveals — all mounting simultaneously causing initial jank.
- Inner pages (`Dashboard`, `PatientDetailView`) also stack multiple `aurora-bg`, `bg-grid`, `hero-glow` layers plus `stat-glow-pulse` animations all firing on mount.
- The `ProfileSetupModal` closes the dialog outer-click, but `onInteractOutside` correctly prevents it — however the dialog renders above the dark background but the dark `ThemeProvider` is not scoped, causing a flash.
- `AccessRestrictedScreen` uses `motion/react` (Framer Motion) — ensure it's available.

## Requested Changes (Diff)

### Add
- A clear, well-designed login/auth status section on the landing page below the CTA buttons: show a loading state during `logging-in`, an error message if `loginError` is set, and a success confirmation before redirect.
- Smooth login button states: idle → spinning "Connecting…" → success flash → auto-proceed.
- An explanatory note below the "Access Dashboard" button: "Uses Internet Identity for secure, passwordless login."
- Lazy-load `SkeletonScene` (Three.js) with a visible skeleton SVG placeholder until WebGL is ready — already partially done but ensure the placeholder renders immediately.
- `will-change: transform` and `contain: layout style paint` on heavy animation containers to promote GPU compositing and avoid layout thrashing.

### Modify
- **`Header.tsx` `handleAuth`**: Remove `await` from `login()` call — it does not return a promise. Wrap in try/catch that only clears on "already authenticated" error. Remove the problematic double-call pattern.
- **`LandingPage.tsx`**: Defer `ParticleCanvas` mount by 300ms after component mount using a `useEffect` timeout so the hero text renders instantly before the canvas starts. Reduce particle count from 110 to 70 for performance.
- **`Dashboard.tsx`**: Remove `aurora-bg` from the Dashboard — it's already on the landing page. Replace with a single subtle radial gradient. Reduce stat card glow pulse to `animation: none` after first 2 cycles (already coded as `2` iterations — keep as is). Remove the `hero-glow` layer since it overlaps the aurora.
- **`PatientDetailView.tsx`**: Same — remove `aurora-bg` and `bg-grid` overlap. Keep one ambient glow orb per page.
- **`index.css`**: Add `prefers-reduced-motion` media query to disable all `animation` and `transition` for accessibility and performance on low-power devices.
- **`ProfileSetupModal.tsx`**: Style the modal to clearly explain what it's for with a subtitle "You're in! Set up your clinician profile to continue." Add a teal glow icon at the top for visual continuity.
- **`AccessRestrictedScreen.tsx`**: Improve messaging — make clear it is invite-only and explain how to get an invite. Add "Contact your administrator for an invite link." Add a visual step indicator (1. Login → 2. Redeem Invite → 3. Access Platform).

### Remove
- Remove the duplicate `await login()` error path in `Header.tsx` that incorrectly shows "User is already authenticated" on normal login flows.
- Remove stacking of `aurora-bg` + `hero-glow` + `bg-grid` on inner pages (keep only `bg-grid` at low opacity).

## Implementation Plan
1. Fix `Header.tsx` handleAuth to call `login()` synchronously (no await), clean up error path.
2. Update `LandingPage.tsx` to defer `ParticleCanvas` mount by 300ms and reduce particles to 70.
3. Update login button on landing page with proper states (idle/connecting/error feedback) and add a helper note below buttons.
4. Update `ProfileSetupModal.tsx` with improved UI and clearer messaging.
5. Update `AccessRestrictedScreen.tsx` with step indicator and better copy.
6. Remove redundant layered background animations from `Dashboard.tsx` and `PatientDetailView.tsx`.
7. Add `prefers-reduced-motion` block in `index.css`.
8. Add `will-change` hints on heavy animated containers.
