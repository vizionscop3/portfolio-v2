/**
 * VIZIONSCOPE Brand Colors - Official Color Palette
 *
 * This file serves as the single source of truth for all brand colors
 * used throughout the VIZIONSCOPE portfolio website.
 *
 * Based on the cyberpunk aesthetic with three-layer text effects:
 * Purple (bottom) → Magenta (middle) → Cyan (top)
 */

export const BRAND_COLORS = {
  // Primary Brand Colors (Official Palette)
  PRIMARY_MAGENTA: '#8A038C', // Main brand color (middle layer)
  SECONDARY_PURPLE: '#580259', // Secondary brand color (bottom layer)
  ACCENT_CYAN: '#00F7ED', // Accent color (top layer)
  DARK_GRAY: '#404040', // Dark gray for backgrounds
  MATTE_BLACK: '#0D0D0D', // Deep black for main backgrounds

  // Color Aliases for Semantic Usage
  LAYER_BOTTOM: '#580259', // Purple - Bottom text layer
  LAYER_MIDDLE: '#8A038C', // Magenta - Middle text layer
  LAYER_TOP: '#00F7ED', // Cyan - Top text layer

  // RGB Values for CSS rgba() usage
  PRIMARY_MAGENTA_RGB: '138, 3, 140',
  SECONDARY_PURPLE_RGB: '88, 2, 89',
  ACCENT_CYAN_RGB: '0, 247, 237',
  DARK_GRAY_RGB: '64, 64, 64',
  MATTE_BLACK_RGB: '13, 13, 13',
} as const;

/**
 * CSS Custom Properties for consistent usage
 * Use these in CSS files for maintainable theming
 */
export const CSS_VARIABLES = {
  '--brand-primary': BRAND_COLORS.PRIMARY_MAGENTA,
  '--brand-secondary': BRAND_COLORS.SECONDARY_PURPLE,
  '--brand-accent': BRAND_COLORS.ACCENT_CYAN,
  '--brand-dark': BRAND_COLORS.DARK_GRAY,
  '--brand-black': BRAND_COLORS.MATTE_BLACK,

  // Layer-specific variables for text effects
  '--layer-bottom': BRAND_COLORS.LAYER_BOTTOM,
  '--layer-middle': BRAND_COLORS.LAYER_MIDDLE,
  '--layer-top': BRAND_COLORS.LAYER_TOP,
} as const;

/**
 * Tailwind CSS class mappings
 * Use these classes in React components
 */
export const TAILWIND_CLASSES = {
  // Text colors
  TEXT_PRIMARY: 'text-brand-primary', // #8A038C
  TEXT_SECONDARY: 'text-brand-secondary', // #580259
  TEXT_ACCENT: 'text-brand-accent', // #00F7ED
  TEXT_DARK: 'text-brand-dark', // #404040
  TEXT_BLACK: 'text-brand-black', // #0D0D0D

  // Background colors
  BG_PRIMARY: 'bg-brand-primary', // #8A038C
  BG_SECONDARY: 'bg-brand-secondary', // #580259
  BG_ACCENT: 'bg-brand-accent', // #00F7ED
  BG_DARK: 'bg-brand-dark', // #404040
  BG_BLACK: 'bg-brand-black', // #0D0D0D

  // Border colors
  BORDER_PRIMARY: 'border-brand-primary', // #8A038C
  BORDER_SECONDARY: 'border-brand-secondary', // #580259
  BORDER_ACCENT: 'border-brand-accent', // #00F7ED
  BORDER_DARK: 'border-brand-dark', // #404040
} as const;

/**
 * Usage Guidelines:
 *
 * 1. Three-Layer Text Effects:
 *    - Bottom Layer: SECONDARY_PURPLE (#580259)
 *    - Middle Layer: PRIMARY_MAGENTA (#8A038C)
 *    - Top Layer: ACCENT_CYAN (#00F7ED)
 *
 * 2. Form Elements:
 *    - Labels: ACCENT_CYAN (#00F7ED)
 *    - Borders: PRIMARY_MAGENTA (#8A038C) or SECONDARY_PURPLE (#580259)
 *    - Focus states: ACCENT_CYAN (#00F7ED)
 *
 * 3. Backgrounds:
 *    - Main: MATTE_BLACK (#0D0D0D)
 *    - Secondary: DARK_GRAY (#404040)
 *    - Overlays: Use rgba() with RGB values provided
 *
 * 4. Interactive Elements:
 *    - Hover states: Lighter variations of brand colors
 *    - Active states: ACCENT_CYAN (#00F7ED)
 *    - Disabled states: DARK_GRAY (#404040)
 */
