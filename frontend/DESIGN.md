---
name: Midnight Luxe
colors:
  surface: '#0d1513'
  surface-dim: '#0d1513'
  surface-bright: '#333b38'
  surface-container-lowest: '#08100e'
  surface-container-low: '#151d1b'
  surface-container: '#19211f'
  surface-container-high: '#232c29'
  surface-container-highest: '#2e3634'
  on-surface: '#dce4e1'
  on-surface-variant: '#c0c8c3'
  inverse-surface: '#dce4e1'
  inverse-on-surface: '#2a3230'
  outline: '#8a938e'
  outline-variant: '#404945'
  surface-tint: '#a1d1bf'
  primary: '#a1d1bf'
  on-primary: '#04382b'
  primary-container: '#2d5a4c'
  on-primary-container: '#a0cfbe'
  inverse-primary: '#3a6758'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#b8cac4'
  on-tertiary: '#23342f'
  tertiary-container: '#445550'
  on-tertiary-container: '#b7c9c3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#bcedda'
  primary-fixed-dim: '#a1d1bf'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#214f41'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#d4e7e0'
  tertiary-fixed-dim: '#b8cac4'
  on-tertiary-fixed: '#0e1e1b'
  on-tertiary-fixed-variant: '#3a4a46'
  background: '#0d1513'
  on-background: '#dce4e1'
  surface-variant: '#2e3634'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 60px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The brand personality is exclusive, sophisticated, and trend-forward, tailored for a high-end clientele that values both tradition and modern edge. The visual narrative is "Midnight Luxe"—a design direction that leverages deep, atmospheric dark tones to create a sense of intimacy and prestige.

The style is a fusion of **Modern Minimalism** and **Glassmorphism**. It utilizes high-contrast typography and vast negative space to allow visual assets (photography of textures, hair, and interiors) to breathe. Subtle frosted surfaces provide a layer of depth without breaking the clean, architectural lines of the interface. The emotional response should be one of calm, professional excellence, and expensive taste.

## Colors
The palette is rooted in deep, desaturated tones to maintain a premium "dark mode" aesthetic. 

- **Primary (#2d5a4c):** A rich Emerald Green used for primary actions, success states, and key brand moments. It should be used sparingly to maintain its impact.
- **Secondary (#d4af37):** Champagne Gold, reserved for high-level highlights, interactive states (hover/active), and decorative accents like thin borders or iconography.
- **Tertiary (#1a2a26):** A lifted charcoal with a green undertone, used for surface containers, cards, and input backgrounds to create subtle layering.
- **Neutral (#0f1715):** The "Midnight" base. This near-black serves as the global background color, ensuring maximum contrast for gold and white typography.

## Typography
The typographic system relies on the tension between the high-contrast, editorial feel of **Playfair Display** and the clean, geometric precision of **Montserrat**.

Headlines should use Playfair Display to evoke a fashion-magazine aesthetic. Use tight letter spacing for large display type. Body text uses Montserrat to ensure high legibility on dark backgrounds; a slightly increased line-height is essential to prevent text from feeling "cramped" in a dark UI. Labels and buttons should always use Montserrat in medium or semi-bold weights, often paired with uppercase styling and tracking to denote hierarchy and "luxury" labeling.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to enforce the "luxury" feel of whitespace. 

- **Desktop:** 12-column grid with 24px gutters. Use wide 64px outer margins to center-align core content, creating a focused, editorial column.
- **Mobile:** 4-column grid with 16px gutters and 20px margins. 
- **Rhythm:** All spacing (padding, margins, gap) should be multiples of the 8px base unit. For component grouping, use 16px (2x); for section separation, use 80px (10x) or 120px (15x) to maintain a sense of grandeur.

## Elevation & Depth
In this dark environment, depth is created through **Tonal Layers** and **Glassmorphism** rather than heavy shadows.

- **Level 0 (Base):** #0f1715.
- **Level 1 (Cards/Containers):** #1a2a26 with a 1px solid border of #2d5a4c at 20% opacity.
- **Level 2 (Modals/Popovers):** Surface uses #1a2a26 with a 40% backdrop-blur effect.
- **Overlays:** Use a subtle 10% Gold (#d4af37) inner-glow on active elements to simulate light hitting a polished surface.
- **Shadows:** If used, shadows must be ultra-diffused (32px+ blur) and tinted with the Primary Emerald color at 15% opacity, creating a subtle atmospheric glow rather than a black drop-shadow.

## Shapes
The shape language is **Soft** and architectural. Standard components like buttons and input fields use a 0.25rem (4px) radius to maintain a sharp, precise, and professional appearance. 

Larger containers (Cards, Modals) use 0.75rem (12px) to provide a modern, approachable touch. Avoid full "pill" shapes for buttons to keep the design feeling structured and high-end; instead, use the "Soft" 4px radius consistently across all interactive elements.

## Components
- **Buttons:** Primary buttons are solid Emerald (#2d5a4c) with White text. Secondary buttons are outlined in Gold (#d4af37) with Gold text. All buttons use Montserrat SemiBold, uppercase, with 1px letter spacing.
- **Inputs:** Fields use the Tertiary background (#1a2a26) with a bottom-only border in 20% White for a minimalist, "boutique" look. On focus, the border transitions to solid Gold (#d4af37).
- **Cards:** Use a very subtle gradient from #1a2a26 to #0f1715 to create a sense of curvature. Borders are 1px, #2d5a4c at 15% opacity.
- **Chips/Badges:** Small, rounded-sm badges using Gold text on a 10% Gold background for "Premium" or "New" status indicators.
- **Lists:** Service lists should feature high-contrast Playfair Display titles with Montserrat descriptions, separated by thin 1px lines in #2d5a4c (20% opacity).
- **Specialty Component (The Booking Slot):** Time slots should appear as dark ghost-buttons that "illuminate" with a Gold border and Emerald glow upon selection.