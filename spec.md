# PhysioAssist – Clinical AI for Physiotherapy

## Current State

The app is a full-stack physiotherapy assistant with:
- Landing page with 3D skeleton, particle animations, glassmorphism feature cards
- Patient assessment modules (subjective + objective), clinical scales, red-flag detection
- Posture analysis with camera upload and AI interpretation
- AI treatment plan generator (generateAIPlan backend call)
- Therapy modalities library (22 therapies with dosage, frequency, method)
- Voice Clinical Scribe (Web Speech API → SOAP notes)
- Progress tracking dashboard with animated stat cards
- Access Management panel (admin can block, restore, remove users)
- Authorization component already in use (roles: admin, user, guest)
- All inner pages share the same dark 3D glassmorphism design as the landing page

## Requested Changes (Diff)

### Add
- **Invite-link system**: Admin can generate invite links from the Access Management page. Only users who register via a valid invite link are granted access to the platform. Non-invited users see an "Access Denied / Request Access" screen instead of the dashboard.
- **Invite management UI**: In the Access Management page, a new "Invite Links" tab (alongside Users tab) lets admin create, view, copy, and revoke invite links. Each link shows its status (active/used/revoked), creation date, and usage count.
- **Guest landing screen**: Authenticated users without a valid invite see a styled "Access Restricted" screen explaining they need an invite link, with a note to contact the admin.

### Modify
- **AccessManagement page**: Add a second tab — "Invite Links" — alongside the existing "Users" tab.
- **App.tsx flow**: After login, check if user has access (role != guest OR has used an invite). If they are a `guest` role without an accepted invite, show the restricted screen.

### Remove
- Nothing removed.

## Implementation Plan

1. Select the `invite-links` Caffeine component (adds backend invite-link logic + frontend hooks).
2. In `AccessManagement.tsx`, add a second "Invite Links" tab with:
   - A button to generate a new invite link (calls `createInviteLink` or equivalent hook)
   - A list of existing invite links with copy-to-clipboard, status badge, and revoke button
3. In `App.tsx`, add routing logic: if authenticated but role is `guest`, render an `AccessRestrictedScreen` component instead of `Dashboard`.
4. Create `AccessRestrictedScreen` component with the same dark 3D design — large lock icon with glow, explanation text, a "You need an invite link to access PhysioAssist" message, and contact admin note.
5. All new UI must match the existing dark glassmorphism 3D aesthetic (OKLCH tokens, glass-card, icon-glow-* classes, badge-neon).
