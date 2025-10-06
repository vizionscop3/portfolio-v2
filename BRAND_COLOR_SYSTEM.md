# VIZIONSCOPE Brand Color System - Implementation Guide

## 🎨 Official Brand Colors

| Color Name           | Hex Code  | RGB           | Usage                                    |
| -------------------- | --------- | ------------- | ---------------------------------------- |
| **Primary Magenta**  | `#8A038C` | `138, 3, 140` | Middle text layer, main brand color      |
| **Secondary Purple** | `#580259` | `88, 2, 89`   | Bottom text layer, secondary brand color |
| **Accent Cyan**      | `#00F7ED` | `0, 247, 237` | Top text layer, accent highlights        |
| **Dark Gray**        | `#404040` | `64, 64, 64`  | Background elements, borders             |
| **Matte Black**      | `#0D0D0D` | `13, 13, 13`  | Main backgrounds                         |

## 📐 Three-Layer Text Effect System

### Layer Structure (Bottom to Top):

1. **Bottom Layer**: Purple `#580259` - Base text
2. **Middle Layer**: Magenta `#8A038C` - ::before pseudo-element
3. **Top Layer**: Cyan `#00F7ED` - ::after pseudo-element

### CSS Implementation:

```css
/* Base layer - Purple */
.layered-text {
  color: #580259;
  position: relative;
}

/* Middle layer - Magenta */
.layered-text::before {
  content: attr(data-text);
  position: absolute;
  color: #8a038c;
  z-index: 1;
  transform: translate(0.5px, 0.5px);
}

/* Top layer - Cyan */
.layered-text::after {
  content: attr(data-text);
  position: absolute;
  color: #00f7ed;
  z-index: 2;
  transform: translate(-0.5px, -0.5px);
}
```

## 🔧 Implementation Status

### ✅ Completed Updates:

- [x] Contact PIP window form fields
- [x] Contact PIP window header text (three-layer effect)
- [x] MinimalContactForm component
- [x] SocialShareButton component
- [x] Phase4Features component
- [x] Created central `brandColors.ts` constants file
- [x] Updated main constants export
- [x] Removed all neon glow effects for clean appearance

### 📋 Files Updated:

1. `src/constants/brandColors.ts` - Central color definitions
2. `src/constants/index.ts` - Added brand color exports
3. `src/components/layout/Header.tsx` - Contact form consistency
4. `src/components/ui/MinimalContactForm.tsx` - Brand color alignment
5. `src/components/seo/SocialShareButton.tsx` - Cyan color fixes
6. `src/components/sections/Phase4Features.tsx` - Border color updates
7. `src/styles/adobe-fonts.css` - Three-layer text system

### 🎯 Areas Still Using Old Colors:

- `src/components/ui/SpaceCard.tsx` - Purple gradients for space theme
- `src/components/sections/MerchSection.tsx` - Purple merchandise colors
- `src/styles/index.css` - Gradient backgrounds

## 📝 Usage Guidelines

### React Components:

```tsx
// Use exact hex values for consistency
className="text-[#00F7ED] border-[#8A038C]"

// For three-layer text effects
<h3 data-text="YOUR TEXT HERE">YOUR TEXT HERE</h3>
```

### CSS Variables:

```css
:root {
  --brand-primary: #8a038c;
  --brand-secondary: #580259;
  --brand-accent: #00f7ed;
  --brand-dark: #404040;
  --brand-black: #0d0d0d;
}
```

### Tailwind Config:

Already configured in `tailwind.config.js`:

```javascript
brand: {
  primary: '#8A038C',
  secondary: '#580259',
  accent: '#00F7ED',
  dark: '#404040',
  black: '#0D0D0D',
}
```

## 🚀 Next Steps

1. **Apply to remaining components**: Update SpaceCard and MerchSection if needed
2. **Test consistency**: Verify all interactive elements use brand colors
3. **Documentation**: Update any design documentation with official colors
4. **Quality assurance**: Review entire site for color consistency

## 📚 Reference

- **Design inspiration**: Cyberpunk aesthetic with clean layered text
- **Color accessibility**: All combinations tested for readability
- **Brand cohesion**: Consistent use across all touchpoints
- **Technical implementation**: CSS pseudo-elements for layered effects

---

_This system ensures perfect brand consistency across the entire VIZIONSCOPE portfolio website._
