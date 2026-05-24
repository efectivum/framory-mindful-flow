## Goal

Bring `Insights.tsx` and its sub-components in line with the serene Scandinavian design system used across the rest of the app. Today they still use the old dark theme: hardcoded `text-white`, `bg-gray-800/50`, `border-gray-700/50`, vivid purple/green/orange gradients, and `text-gray-400`. Refactor to semantic tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `text-primary`) and the `card-serene` utility.

## Files to update

### `src/pages/Insights.tsx`
No structural change needed — already uses `ResponsiveLayout` and semantic layout classes. Leave as-is.

### `src/components/insights/InsightStatsCards.tsx`
- Replace inline `linear-gradient(...)` purples/greens/oranges with the serene treatment: each stat card becomes a `card-serene` with a soft tinted icon container (`bg-primary/10`, `bg-accent/40`, `bg-muted`).
- Swap `text-white`, `text-white/80`, `text-white/60` for `text-foreground` / `text-muted-foreground`.
- Keep the FlippableCard structure; restyle front and back to use `card-serene p-6` with semantic text colors.
- Remove `Badge` "Insight" label or restyle with `variant="secondary"`.

### `src/components/insights/InsightSidebar.tsx`
- Replace `Card` with `bg-gray-800/50 border-gray-700/50 backdrop-blur-sm` → `card-serene` wrapper `div`s (or keep `Card` but drop the dark classes).
- Stat tiles: `bg-gray-700/30 border-gray-600/30` → `bg-muted/40 border border-border rounded-2xl`.
- Text: `text-white` → `text-foreground`; `text-gray-400` → `text-muted-foreground`; `text-purple-300` → `text-primary`; icon `text-blue-300` → `text-primary`.

### `src/components/insights/InsightEmptyState.tsx`
- Replace purple gradient circle with `icon-container-lg` (semantic primary tint).
- `text-white` → `text-foreground`; `text-gray-400` → `text-muted-foreground`.
- Keep the `TrendingUp` icon, color it `text-primary`.

## Out of scope

- Deeper chart components (`MoodTrendChart`, `PersonalityRadarChart`, `EmotionBubbleChart`, `RecurringTopics`, `MiniCalendar`, `PremiumGate`) — touched only if they break visually after the wrapper changes; otherwise left untouched.
- No business-logic or data-flow changes.

## Verification

- Visit `/insights` in the preview at mobile viewport, confirm:
  - Stat cards render light, no dark gradients, flip still works.
  - Sidebar cards use serene surfaces and readable text.
  - Empty state matches the rest of the app when there are no entries.
- Grep the three files for `text-white`, `bg-gray-`, `border-gray-`, `text-gray-` to confirm they're gone.
