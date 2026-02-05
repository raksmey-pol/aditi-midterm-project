# MyStore - E-commerce UI Design System

## Overview
A modern, clean, and professional UI design system for the MyStore e-commerce platform built with Next.js, Tailwind CSS, and React.

---

## Design Principles

### 1. **Clarity & Simplicity**
- Clean visual hierarchy with generous whitespace
- Clear CTAs (Call-to-Action) buttons
- Intuitive navigation structure
- Minimal distractions

### 2. **Modern Aesthetics**
- Gradient accents (Blue-600 to Purple-600)
- Rounded corners (24-32px border radius)
- Smooth animations and transitions
- Glass morphism effects for depth

### 3. **Accessibility**
- WCAG 2.1 AA compliant colors
- Focus states for keyboard navigation
- Semantic HTML structure
- Responsive design for all devices

### 4. **Performance**
- Optimized animations (GPU accelerated)
- Lazy loading for images
- Efficient CSS with Tailwind
- Fast loading times

---

## Color Palette

### Primary Colors
- **Blue**: `oklch(0.488 0.243 264.376)` - Brand color
- **Purple**: `oklch(0.627 0.265 303.9)` - Accent color
- **Teal**: `oklch(0.696 0.17 162.48)` - Secondary action

### Neutral Colors
- **White**: `oklch(1 0 0)`
- **Dark Gray**: `oklch(0.145 0 0)`
- **Light Gray**: `oklch(0.97 0 0)`
- **Medium Gray**: `oklch(0.556 0 0)`

### Status Colors
- **Success**: `oklch(0.696 0.17 162.48)` - Green
- **Warning**: `oklch(0.828 0.189 84.429)` - Orange
- **Destructive**: `oklch(0.577 0.245 27.325)` - Red
- **Info**: `oklch(0.6 0.118 184.704)` - Blue

---

## Typography

### Font Family
- **Primary**: Geist Sans (variable font)
- **Monospace**: Geist Mono (for code)

### Font Sizes & Weights
- **Display**: 4xl-6xl, Bold (800), 1.3 line-height
- **Heading**: 3xl-4xl, Bold (700), 1.2 line-height
- **Subheading**: xl-2xl, Semibold (600), 1.2 line-height
- **Body**: Base, Regular (400), 1.6 line-height
- **Caption**: sm, Regular (400), 1.4 line-height

### Font Scaling
```
Mobile: 1rem base
Tablet: 1.125rem base
Desktop: 1.25rem base
```

---

## Component Library

### Navbar
- **Height**: 64px (h-16)
- **Background**: White/Dark with backdrop blur
- **Logo Size**: 40px (w-10 h-10)
- **Features**:
  - Sticky positioning
  - Smooth dropdown menus
  - Search bar integration
  - Action buttons (wishlist, cart, user)
  - Mobile hamburger menu

**Styling**:
```tsx
className="sticky top-0 z-50 backdrop-blur-md bg-white dark:bg-gray-950 
           border-b border-gray-200 dark:border-gray-800 shadow-md"
```

### Hero Slider
- **Aspect Ratio**: 16:9 (responsive)
- **Border Radius**: 24px (rounded-3xl)
- **Padding**: py-20 lg:py-32
- **Background**: Gradient (multiple slides)
- **Features**:
  - Auto-rotating slides (5s interval)
  - Manual controls with dots
  - Animated text transitions
  - CTA buttons
  - Responsive layout

**Styling**:
```tsx
className="relative overflow-hidden rounded-3xl mx-4 lg:mx-8 my-8 
           bg-gradient-to-br"
```

### Product Cards
- **Layout**: Responsive grid (1-4 columns)
- **Border Radius**: 24px (rounded-3xl)
- **Image Height**: 288px (h-72)
- **Hover Effects**:
  - Shadow increase
  - Image scale (105%)
  - Y-axis translation (-4px)
  - Quick view overlay

**Styling**:
```tsx
className="group relative overflow-hidden rounded-3xl border border-gray-200 
           dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
```

### Category Cards
- **Grid**: 2-6 columns (responsive)
- **Border Radius**: 24px
- **Icon Size**: 32px with rounded background
- **Hover Effects**:
  - Scale up (110%)
  - Shadow increase
  - Y-axis translation (-8px)
  - Color transitions

### Footer
- **Background**: Dark gray (bg-gray-950)
- **Padding**: pt-16 pb-8
- **Grid**: 4 columns on desktop
- **Sections**:
  - Brand information
  - Quick links
  - Product categories
  - Customer service
  - Newsletter signup

---

## Spacing System

### Padding/Margin (Tailwind scale)
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px

### Section Spacing
- **Mobile**: 12px-16px horizontal, 16px vertical
- **Desktop**: 32px-48px horizontal, 20-24px vertical

---

## Border Radius Scale
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 32px

---

## Shadow System

### Light Shadows
- **shadow-sm**: 0 1px 2px
- **shadow-md**: 0 4px 8px
- **shadow-lg**: 0 10px 15px
- **shadow-xl**: 0 20px 25px
- **shadow-2xl**: 0 25px 50px

### Usage
- Default: shadow-md
- Hover: shadow-xl to shadow-2xl
- Active: shadow-lg

---

## Button Styles

### Primary Button
```tsx
className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 
           font-semibold shadow-lg group"
```

### Secondary Button
```tsx
className="border-2 border-white text-white hover:bg-white/20 rounded-full 
           px-8 font-semibold"
```

### Tertiary Button
```tsx
className="text-blue-600 hover:text-blue-700 rounded-lg px-4 py-2 
           transition-colors"
```

---

## Animation & Transitions

### Standard Transitions
- **Duration**: 300ms (default)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)

### Keyframe Animations
- **fadeInUp**: Fade in + slide up (600ms)
- **slideInRight**: Slide in from right (600ms)
- **slideInLeft**: Slide in from left (600ms)
- **scaleIn**: Scale up (500ms)
- **shimmer**: Loading skeleton (2s, infinite)

### Hover Animations
- **Scale**: 100% → 105% (200ms)
- **Translate**: 0px → -4px (300ms)
- **Opacity**: Smooth fade (300ms)

---

## Responsive Breakpoints

```
Mobile: 0px - 640px (default)
sm: 640px+
md: 768px+
lg: 1024px+
xl: 1280px+
2xl: 1536px+
```

### Mobile-First Strategy
- Design for mobile first
- Progressively enhance for larger screens
- Hide/show elements based on breakpoints

---

## Dark Mode

### Implementation
- Using `prefers-color-scheme` media query
- Manual toggle support via `.dark` class
- Tailwind's `dark:` prefix utilities

### Dark Mode Colors
- Background: `bg-gray-950` (near black)
- Cards: `bg-gray-800` to `bg-gray-900`
- Text: `text-gray-300` (not pure white for readability)
- Borders: Semi-transparent white (`opacity-10-20%`)

---

## Best Practices

### Do's ✓
1. Use consistent spacing (multiples of 4px)
2. Maintain proper contrast ratios (4.5:1 for text)
3. Provide focus states for keyboard navigation
4. Use semantic HTML (nav, section, article, etc.)
5. Optimize images and lazy load
6. Use GPU-accelerated transitions
7. Test on real devices
8. Keep animations under 300ms for most cases

### Don'ts ✗
1. Don't use too many colors (max 5-6 primary colors)
2. Don't create animation loops longer than necessary
3. Don't sacrifice accessibility for aesthetics
4. Don't use auto-playing audio/video without controls
5. Don't create clickable elements smaller than 44x44px
6. Don't use text smaller than 14px for body copy
7. Don't forget alt text on images

---

## Component States

### Buttons
- **Default**: Base styling
- **Hover**: Scale up, shadow increase
- **Active**: Slightly darker, pressed effect
- **Disabled**: Opacity 50%, cursor not-allowed
- **Loading**: Spinner animation

### Form Inputs
- **Default**: Light border, light background
- **Focus**: Blue ring (2px), border change
- **Error**: Red border, error message
- **Success**: Green checkmark
- **Disabled**: Gray background, no interaction

### Product Cards
- **Default**: Subtle shadow
- **Hover**: Image zoom (105%), card elevation
- **Active**: Highlighted border
- **Loading**: Skeleton animation

---

## Accessibility Guidelines

### Keyboard Navigation
- Tab order follows visual flow
- Focus states clearly visible (2px outline)
- Escape key closes modals
- Enter/Space activates buttons

### Screen Readers
- Semantic HTML landmarks
- ARIA labels for icons
- Skip navigation link
- Alt text for all images
- Form labels associated with inputs

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

### Motion
- Respect `prefers-reduced-motion` setting
- Provide pause/stop controls for animations
- No auto-playing videos

---

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Implement responsive srcset
- Use WebP format with fallbacks
- Lazy load below-the-fold images

### CSS Optimization
- Utilize Tailwind's purge (tree-shaking)
- Avoid inline styles
- Use CSS variables for theming
- Minimize specificity

### JavaScript Optimization
- Code splitting with dynamic imports
- Memoize expensive calculations
- Debounce/throttle events
- Use React.lazy() for route-based code splitting

---

## File Structure

```
web/
├── app/
│   ├── layout.tsx (Root layout with metadata)
│   ├── globals.css (Global styles + animations)
│   ├── page.tsx (Home page)
│   ├── shop/
│   │   └── page.tsx (Shop page)
│   └── auth/
│       └── login/
│           └── page.tsx (Login page)
├── components/
│   ├── common/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSlider.tsx
│   │   ├── ProductList.tsx
│   │   ├── Categories.tsx
│   │   └── Manufacturers.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...other UI components
│   └── theme-provider.tsx
└── lib/
    ├── utils.ts
    ├── api-client.ts
    └── services/
```

---

## Future Enhancements

1. **Advanced Filtering**: Multi-select filters with live preview
2. **Product Comparison**: Side-by-side product comparison
3. **Reviews & Ratings**: User reviews with star ratings
4. **Wishlists**: Save favorite products
5. **Personalization**: AI-powered recommendations
6. **Live Chat**: Real-time customer support
7. **Virtual Try-on**: AR product preview
8. **Progressive Web App**: Offline support, app-like experience

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

*Last Updated: January 28, 2026*
*Design System Version: 1.0*
