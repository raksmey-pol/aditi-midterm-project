# MyStore UI - Quick Reference Guide

## Quick Start

### Color Palette Quick Reference

```
🔵 Primary Blue: from-blue-600 to-purple-600
🟢 Teal/Success: from-teal-500 to-green-500
🔴 Error/Red: from-red-500
🟡 Warning/Orange: from-orange-500
⚪ Light Gray: from-gray-100 to-gray-200
⚫ Dark Gray: from-gray-800 to-gray-900
```

### Common Class Combinations

#### Card Components
```tsx
// Product Card
className="rounded-3xl border border-gray-200 dark:border-gray-700 
           hover:shadow-2xl transition-all duration-300"

// Category Card
className="rounded-3xl hover:shadow-2xl hover:-translate-y-2 
           transition-all duration-300"
```

#### Sections
```tsx
// Section with padding
className="container mx-auto px-4 py-16 lg:py-20"

// Section heading
className="text-4xl lg:text-5xl font-bold tracking-tight"

// Section subheading
className="text-gray-500 dark:text-gray-400 mt-3 text-lg"
```

#### Buttons
```tsx
// Primary CTA (Hero)
className="bg-white text-gray-900 hover:bg-gray-100 rounded-full 
           px-8 font-semibold shadow-lg group"

// Secondary Button
className="border-2 border-white text-white hover:bg-white/20 
           rounded-full px-8 font-semibold"

// Text Link
className="text-blue-600 hover:text-blue-700 transition-colors"
```

#### Navigation
```tsx
// Navbar link
className="flex items-center px-4 py-2 text-sm font-medium 
           text-gray-700 dark:text-gray-300 hover:text-blue-600 
           transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"

// Dropdown
className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 
           rounded-xl shadow-xl border border-gray-200 
           dark:border-gray-700 py-2 z-50"
```

### Icon Sizes
```tsx
// Icon buttons
h-4 w-4    // Small (nav icons)
h-5 w-5    // Medium (action icons)
h-6 w-6    // Large (badge icons)
h-8 w-8    // Extra large (category icons)
```

### Border Radius Classes
```
rounded-lg     → 8px
rounded-xl     → 12px
rounded-2xl    → 16px
rounded-3xl    → 24px (preferred for cards)
rounded-full   → 50% (buttons)
```

### Shadow Classes
```
shadow-sm     → subtle shadow
shadow-md     → default shadow
shadow-lg     → medium shadow
shadow-xl     → elevated shadow
shadow-2xl    → strong shadow (hover state)
```

### Spacing Utilities
```
p-4    → 16px padding
m-4    → 16px margin
gap-4  → 16px gap
space-y-4  → 16px vertical spacing
```

### Responsive Prefixes
```
md:     → screens 768px+
lg:     → screens 1024px+
xl:     → screens 1280px+

Example: lg:py-20 → 20px padding (80px) on desktop
```

### Dark Mode
```tsx
// Light mode only
className="bg-gray-100 text-gray-900"

// Dark mode override
className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"

// Dark mode specific
className="dark:border-gray-700 dark:hover:bg-gray-800"
```

## Animation & Transition Examples

### Hover Animations
```tsx
// Scale on hover
className="hover:scale-105 transition-transform duration-300"

// Translate on hover
className="hover:-translate-y-1 transition-transform duration-300"

// Shadow increase on hover
className="hover:shadow-2xl transition-shadow duration-300"

// Combined hover effect
className="hover:scale-105 hover:shadow-2xl transition-all duration-300"
```

### Fade In Animation
```tsx
// Slide in from top
className="animate-in slide-in-from-top-5"

// Fade in
className="animate-in fade-in-0"

// Combined
className="animate-in fade-in-0 slide-in-from-top-5"
```

### Custom Animations (from globals.css)
```tsx
className="animate-fadeInUp"       // Fade + slide up
className="animate-slideInRight"   // Slide from right
className="animate-slideInLeft"    // Slide from left
className="animate-scaleIn"        // Scale up animation
className="animate-shimmer"        // Loading skeleton
```

## Typography Scale

### Heading Sizes
```tsx
// Hero Title
className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight"

// Section Title
className="text-4xl lg:text-5xl font-bold tracking-tight"

// Subsection
className="text-3xl lg:text-4xl font-bold tracking-tight"

// Small heading
className="text-2xl font-semibold"

// Body text
className="text-base leading-relaxed"

// Small text
className="text-sm text-gray-500"
```

## Form Components

### Input Field
```tsx
className="px-4 py-2.5 w-full rounded-full border border-gray-300 
           dark:border-gray-600 bg-gray-50 dark:bg-gray-800 
           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
           transition-all"
```

### Input with Icon
```tsx
// Container with relative positioning
className="relative w-full"

// Icon positioning
className="absolute left-3 top-1/2 transform -translate-y-1/2 
           text-gray-400 h-4 w-4"

// Input with padding for icon
className="pl-10 pr-4 ..."
```

## Badge & Label Components

### Badge Style
```tsx
className="inline-flex items-center gap-2 bg-white/10 
           backdrop-blur-sm rounded-full px-4 py-2 
           text-sm font-medium text-white"
```

### Discount Badge
```tsx
className="bg-red-500 text-white text-xs font-bold 
           px-3 py-1 rounded-full"
```

### Category Badge
```tsx
className="bg-blue-500 text-white text-xs font-bold 
           px-3 py-1 rounded-full"
```

## Grid Layouts

### Product Grid
```tsx
// 1 column mobile, 2 tablet, 4 desktop
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"

// 2 columns mobile, 3 tablet, 6 desktop (categories)
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
```

## Overlay & Modals

### Image Overlay (Hover)
```tsx
className={`absolute inset-0 bg-black/50 flex items-center justify-center 
           gap-4 transition-opacity duration-300 ${
           hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
           }`}
```

### Glass Background
```tsx
className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"

// Dark mode
className="dark:bg-black/10 dark:backdrop-blur-sm"
```

## Common Patterns

### Flex Center
```tsx
className="flex items-center justify-center"
```

### Flex Between
```tsx
className="flex items-center justify-between"
```

### Grid Center
```tsx
className="grid place-items-center"
```

### Absolute Center
```tsx
className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
```

### Sticky Header
```tsx
className="sticky top-0 z-50 bg-white dark:bg-gray-950"
```

### Container Constraints
```tsx
// Full width container
className="container mx-auto"

// With padding
className="container mx-auto px-4"

// With max-width and centered
className="container mx-auto px-4 max-w-7xl"
```

## State Classes

### Disabled State
```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Error State
```tsx
className="border-red-500 focus:ring-red-500"
```

### Success State
```tsx
className="border-green-500 focus:ring-green-500"
```

## Accessibility Helpers

### Visually Hidden (SR only)
```tsx
className="sr-only"
```

### Focus Ring
```tsx
className="focus:outline-2 focus:outline-offset-2 outline-blue-600"
```

## Performance Tips

### Lazy Loading
```tsx
// Use Next.js Image component
<Image
  src="/image.jpg"
  alt="Description"
  loading="lazy"
  width={400}
  height={300}
/>
```

### Code Splitting
```tsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/heavy'), {
  loading: () => <p>Loading...</p>
})
```

## Common Mistakes to Avoid

❌ **Don't**: Mix spacing units (px vs Tailwind scale)
✅ **Do**: Use Tailwind utilities consistently (p-4, m-4, gap-6)

❌ **Don't**: Create custom styles when Tailwind has it
✅ **Do**: Use Tailwind classes first, customize in globals.css

❌ **Don't**: Use inline styles for dynamic colors
✅ **Do**: Use CSS variables or class-based styling

❌ **Don't**: Forget dark mode support
✅ **Do**: Always include `dark:` variants

❌ **Don't**: Use exact pixels for responsive design
✅ **Do**: Use responsive prefixes (md:, lg:, xl:)

---

**Pro Tip**: Use the `@apply` directive in globals.css to create reusable component classes:

```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-6 py-3 rounded-full 
           hover:bg-blue-700 transition-colors;
  }
}
```

Then use: `className="btn-primary"`
