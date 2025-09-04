# Clean Mobile-First Project Foundation

## 1. Design System Approach
- Use Tailwind's built-in responsive prefixes (`sm:`, `md:`, `lg:`)
- Define semantic tokens in CSS variables for brand colors only
- Avoid custom utility classes - use Tailwind's mobile-first defaults

## 2. Component Structure
```tsx
// ✅ Clean mobile-first component pattern
export const MobileCard = ({ children, className }) => (
  <div className={cn(
    // Mobile-first base styles
    "p-4 rounded-lg bg-card border",
    // Responsive enhancements
    "sm:p-6 md:p-8",
    className
  )}>
    {children}
  </div>
);
```

## 3. Layout Strategy
- Mobile-first layouts using Tailwind's responsive grid/flex
- Safe area handling with CSS env() variables
- Bottom navigation for mobile, sidebar for desktop

## 4. CSS Structure
```css
/* index.css - Keep it minimal */
:root {
  /* Only brand colors and semantic tokens */
  --primary: 240 100% 50%;
  --background: 0 0% 100%;
  /* Use Tailwind for everything else */
}

/* Mobile-first responsive typography */
h1 { @apply text-2xl font-bold sm:text-3xl lg:text-4xl; }
```

## 5. Recommended File Structure
```
src/
├── components/
│   ├── ui/           // Shadcn components
│   ├── layout/       // Layout components
│   └── features/     // Feature-specific components
├── hooks/            // Custom hooks
├── lib/              // Utilities
└── pages/            // Route components
```

## Key Principles:
- Start mobile, enhance for desktop
- Use Tailwind's responsive prefixes
- Keep CSS minimal - let Tailwind handle utilities
- Test on mobile device frequently
- One consistent system throughout