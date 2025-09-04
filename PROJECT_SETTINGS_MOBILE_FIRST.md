# STRICT MOBILE-FIRST PROJECT SETTINGS

## 🚨 CRITICAL ENFORCEMENT RULES

### RULE 1: HARDCODED UTILITIES ARE FORBIDDEN
**NEVER USE:** `bg-gray-800`, `text-white`, `w-64`, `h-32`, `p-4`, `m-2`, `text-sm`, etc.
**ALWAYS USE:** `bg-card`, `text-foreground`, `w-full`, `h-auto`, semantic tokens

### RULE 2: MOBILE-FIRST RESPONSIVE DESIGN MANDATORY
```tsx
// ✅ CORRECT - Mobile first, then enhance
className="text-sm sm:text-base lg:text-lg"

// ❌ FORBIDDEN - Desktop first
className="text-lg md:text-sm"
```

### RULE 3: SEMANTIC TOKENS ONLY
```tsx
// ✅ CORRECT
className="bg-card text-card-foreground border-border"

// ❌ FORBIDDEN  
className="bg-white text-black border-gray-200"
```

### RULE 4: NO CUSTOM CSS UTILITIES
```css
/* ❌ FORBIDDEN - Custom utilities */
.custom-spacing { padding: 1.5rem; }

/* ✅ ALLOWED - Only semantic tokens */
:root { --primary: 240 100% 50%; }
```

## 📱 COMPONENT STRUCTURE REQUIREMENTS

### Every Component Must Follow This Pattern:
```tsx
export const ComponentName = ({ className, ...props }) => (
  <div className={cn(
    // Mobile-first base (no prefixes)
    "p-4 rounded-lg bg-card text-card-foreground",
    // Responsive enhancements (with prefixes)
    "sm:p-6 lg:p-8",
    className
  )}>
    {children}
  </div>
);
```

## 🎨 ALLOWED TAILWIND CLASSES

### Layout & Spacing:
- `p-*`, `m-*`, `gap-*` (standard Tailwind spacing scale)
- `w-full`, `h-full`, `min-h-screen`, `max-w-*`
- `flex`, `grid`, `block`, `hidden`

### Typography:
- `text-*` (size scale), `font-*` (weight), `leading-*`, `tracking-*`
- `text-left`, `text-center`, `text-right`

### Colors (SEMANTIC ONLY):
- `bg-background`, `bg-card`, `bg-primary`, `bg-secondary`
- `text-foreground`, `text-muted-foreground`, `text-primary`
- `border-border`, `border-input`

### Responsive Prefixes:
- `sm:*`, `md:*`, `lg:*`, `xl:*` for enhancements

## 🚫 FORBIDDEN PRACTICES

### Never Use These:
- Fixed pixels: `w-[320px]`, `h-[240px]`
- Direct colors: `bg-red-500`, `text-blue-600`
- Desktop-first: `lg:text-sm md:text-xs`
- Custom utilities in components
- Inline styles

## ✅ VALIDATION CHECKLIST

Before any code submission, verify:
- [ ] All colors use semantic tokens
- [ ] Mobile-first responsive pattern used
- [ ] No hardcoded utilities
- [ ] Uses Tailwind's built-in classes only
- [ ] Component follows mobile-first structure

## 🛑 EMERGENCY OVERRIDE

If AI suggests hardcoded utilities, user can respond with:
**"STOP - USE SEMANTIC TOKENS"**

This triggers immediate correction to semantic token approach.

## 📊 APPROVED DESIGN SYSTEM

### Color System (index.css):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```

### Tailwind Config Colors:
```ts
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... etc
}
```

## 🎯 SUCCESS METRICS

A mobile-first project succeeds when:
- Zero hardcoded utilities in components
- All responsive design is mobile-first
- Consistent semantic token usage
- Clean, maintainable component structure
- Fast mobile performance