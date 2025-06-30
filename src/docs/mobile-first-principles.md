
# Mobile-First Design Principles for Lumatori

## Core Philosophy
This project follows a **mobile-first** approach, meaning all features and designs are initially created for mobile devices and then enhanced for larger screens.

## Key Principles

### 1. Touch-First Interactions
- Minimum touch target size: 44px x 44px
- Generous spacing between interactive elements (minimum 12px)
- Clear visual feedback for all touch interactions
- Haptic feedback where supported

### 2. Mobile Navigation
- Bottom navigation bar for primary navigation on mobile
- Sidebar only appears on desktop (md+ breakpoints)
- Navigation should always be accessible and visible
- Use `bottom-navigation-fixed` class for proper positioning

### 3. Responsive Layout Structure
```css
/* Mobile-first media queries */
@media (max-width: 768px) {
  /* Mobile styles here */
}

@media (min-width: 769px) {
  /* Desktop enhancements here */
}
```

### 4. Safe Area Handling
- Always account for iOS safe areas
- Use `env(safe-area-inset-bottom)` for bottom spacing
- Provide fallback values for non-iOS devices

### 5. Performance Considerations
- Lazy load images and heavy components
- Minimize bundle size for mobile networks
- Use CSS transforms for animations (hardware acceleration)
- Debounce user interactions to prevent over-triggering

### 6. Typography and Spacing
- Base font size: 16px (prevents zoom on iOS)
- Mobile spacing variables: `--app-mobile-space-*`
- Organic border radius: `--app-radius-organic` (20px)

### 7. Component Guidelines
- All components should render properly on 320px width minimum
- Use `max-width: 100vw` and `overflow-x: hidden` to prevent horizontal scroll
- Test components on actual mobile devices, not just browser dev tools

## CSS Architecture

### Mobile CSS Variables
```css
:root {
  --bottom-nav-height: 80px;
  --app-mobile-space-xs: 0.125rem;
  --app-mobile-space-sm: 0.375rem;
  --app-mobile-space-md: 0.75rem;
  --app-mobile-space-lg: 1rem;
  --app-mobile-space-xl: 1.25rem;
}
```

### Essential Mobile Classes
- `.bottom-navigation-fixed` - For bottom navigation positioning
- `.touch-manipulation` - For better touch interactions
- `.mobile-button` - Standard mobile button sizing
- `.app-card-organic` - Mobile-optimized card styling

## Testing Checklist
- [ ] Navigation visible and functional on mobile
- [ ] All interactive elements meet 44px minimum size
- [ ] No horizontal scrolling on any screen size
- [ ] Safe area handling works on iOS devices
- [ ] Touch interactions provide proper feedback
- [ ] Loading states are mobile-optimized
- [ ] Forms work properly on mobile keyboards

## Common Mobile Issues to Avoid
1. **Missing bottom navigation** - Always check z-index and positioning
2. **Horizontal overflow** - Use proper width constraints
3. **Tiny touch targets** - Ensure minimum 44px size
4. **Zoom on input focus** - Use 16px font size minimum
5. **Poor safe area handling** - Test on actual iOS devices

## Development Workflow
1. Design and implement for mobile first (320px-768px)
2. Test on actual mobile devices or accurate simulators
3. Enhance for tablet (768px-1024px)
4. Add desktop features (1024px+)
5. Never break mobile functionality when adding desktop features

Remember: **Mobile users are our primary audience. Every feature must work perfectly on mobile before considering desktop enhancements.**
