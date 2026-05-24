# Consolidate on ResponsiveLayout

ResponsiveLayout (with the canonical `BottomNavigation` from `src/components/BottomNavigation.tsx`) is already the standard — used by Today, Profile, Goals, Journal history/entry, Resources, ChallengeDetail. Three pages still use the legacy wrappers, and two files in `src/components/mobile/` are unused dead code that duplicates layout/nav logic and risks design drift.

## Scope

Frontend/presentation only. No business logic, no hook changes, no styling tokens touched.

## Changes

1. **Migrate `src/pages/Journal.tsx`**
   - Replace `MobilePage` / `MobileContent padded` outer wrapping with `<ResponsiveLayout title="Journal" subtitle="...">`.
   - Replace each `<MobileSection>` with a plain `<section className="mb-6">` (preserves vertical rhythm previously provided by `mobile-flow`).
   - Drop the `MobilePage/MobileContent/MobileSection` import.

2. **Migrate `src/pages/JournalWrite.tsx`**
   - Replace the `MobileLayout > MobilePage > MobileContent` stack with `<ResponsiveLayout showHeader={false} hideBottomNav>` so the existing `MobileHeader` and the focused-writing UX stay intact (no bottom nav while drafting).
   - Keep all writing/voice/auto-save logic untouched.

3. **Migrate `src/pages/Insights.tsx`**
   - Replace outer wrappers with `<ResponsiveLayout title="Insights" subtitle="Your patterns and progress">`.
   - Replace `MobileSection` with `<section className="mb-6">`.

4. **Delete dead/legacy files**
   - `src/components/mobile/BottomNavigation.tsx` (no importers).
   - `src/components/mobile/MobileLayout.tsx` (no importers).
   - `src/components/layouts/MobileLayout.tsx` (no importers after step 1–3).

## Out of scope

- `src/components/layouts/AppContainer.tsx` (separate concern, not a duplicate nav).
- The `.mobile-*` utility CSS classes in `src/styles/mobile/*` — they're used by many other components and are not the source of design drift; leaving them in place.
- Visual styling beyond what's needed to keep the three migrated pages looking correct under ResponsiveLayout's max-w-2xl container.

## Verification

- TypeScript build passes (no remaining imports of the deleted files).
- Manually review Journal, JournalWrite, Insights in mobile preview to confirm header, content padding, and bottom nav render via ResponsiveLayout.
