# Figma Design Documentation - Stake Your Habit Landing Page

## 🎨 Complete Design System

### Color Palette

#### Primary Colors
- **Indigo**: `#6366F1` - Main brand color, used for primary CTAs and accents
- **Pink**: `#EC4899` - Secondary brand color, energetic and motivating
- **Gold/Amber**: `#F59E0B` - Wealth and achievement, used for highlights

#### Neutral Colors
- **Dark Slate**: `#0F172A` - Headers, primary text, footer background
- **Light Gray**: `#F8FAFC` - Section backgrounds, cards
- **Medium Gray**: `#64748B` - Body text, supporting information
- **White**: `#FFFFFF` - Card backgrounds, text on dark

#### Semantic Colors
- **Success Green**: `#10B981` - Completed challenges, positive metrics
- **Purple**: `#8B5CF6` - Additional accent for variety
- **Blue**: `#3B82F6` - Investment related content

### Gradient Definitions

```css
/* Primary Gradient - Brand Identity */
linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)
Use: Primary buttons, hero elements, key CTAs

/* Energy Gradient - Call to Action */
linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)
Use: Secondary CTAs, highlighted sections, badges

/* Dark Gradient - Premium Feel */
linear-gradient(135deg, #0F172A 0%, #1E293B 100%)
Use: Footer, dark sections, contrast areas

/* Success Gradient - Positive Actions */
linear-gradient(135deg, #10B981 0%, #3B82F6 100%)
Use: Achievement indicators, success states
```

### Typography System

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', sans-serif;
```

#### Scale
- **Display**: 4rem (64px) - Hero titles
- **H1**: 3rem (48px) - Section headers
- **H2**: 2.5rem (40px) - Subsection titles
- **H3**: 2rem (32px) - Card titles
- **H4**: 1.6rem (25.6px) - Sub-headings
- **Body Large**: 1.25rem (20px) - Hero descriptions
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.9rem (14.4px) - Labels, metadata

#### Weights
- **Black (900)**: Large numbers, display text
- **Extra Bold (800)**: Headings, emphasis
- **Bold (700)**: Sub-headings, labels
- **Semi-bold (600)**: Navigation, buttons
- **Medium (500)**: Body emphasis
- **Regular (400)**: Body text

### Spacing System (8px base unit)

```
4px   - Tiny gaps
8px   - Small spacing
16px  - Medium spacing
24px  - Large spacing
32px  - XL spacing
48px  - XXL spacing
64px  - Section padding (mobile)
128px - Section padding (desktop)
```

### Border Radius Scale

```
8px   - Small elements
12px  - Buttons, small cards
15px  - Medium cards
20px  - Large cards
25px  - Extra large cards
30px  - Sections
50px  - Pills, fully rounded buttons
50%   - Circular elements
```

## 📱 Component Specifications

### Navigation Bar

**Desktop (>768px)**
- Height: 80px (reduced to 64px on scroll)
- Padding: 24px horizontal
- Logo: 24px font size, multi-color
- Links: 16px, 500 weight, 40px spacing
- Buttons: 
  - Login: 14px padding vertical, 28px horizontal, outlined
  - Sign Up: Same padding, gradient filled, shadow

**Mobile (<768px)**
- Hamburger icon: 28px
- Slide-in menu: Full width, slide from right
- Menu items: 16px padding, full width

**States**
- Default: Transparent background
- Scrolled: White background, backdrop blur 10px, shadow
- Hover: Links underline with gradient, scale 1.05
- Active: Link with gradient underline

### Hero Section

**Layout**
- Grid: 2 columns (1fr 1fr) on desktop
- Single column on mobile
- Min-height: 100vh
- Padding: 128px vertical (desktop), 96px (mobile)

**Left Content**
- Badge: 11px padding vertical, 24px horizontal, gradient border
- Title: 64px font, 800 weight, 1.2 line-height
- Description: 20px font, 1.8 line-height, max-width 600px
- Button group: 16px gap
  - Primary: 16px vertical, 32px horizontal padding
  - Secondary: Same padding, outlined

**Right Visual**
- Phone mockup: 300px wide, 600px tall (250px x 500px mobile)
- Border radius: 40px
- Inner screen: 30px border radius
- Floating cards: 60px height, absolute positioned
- Background orbs: 500px, 400px, 300px diameter

**Animations**
- Title: Fade in from Y: 50px, 0.8s duration
- Description: Fade in, 0.5s delay
- Buttons: Fade in, 0.7s delay
- Stats: Stagger 0.1s each, fade + slide up
- Floating cards: Infinite float, 5-6s duration

### Section Headers (Reusable)

**Structure**
- Badge: 10px vertical, 24px horizontal, gradient border
- Title: 48px font, 800 weight, center aligned
- Description: 19.2px font, max-width 800px, center

**Spacing**
- Badge bottom margin: 24px
- Title bottom margin: 24px
- Description bottom margin: 80px (before grid)

### Card Components

**Feature Card**
- Padding: 40px
- Border radius: 20px
- Background: Light gray (#F8FAFC)
- Border: 1px transparent, becomes primary on hover
- Icon box: 70px square, 18px radius, gradient background
- Title: 24px, 700 weight, 16px bottom margin
- Description: 17px, 1.7 line-height

**Testimonial Card**
- Padding: 40px
- Border radius: 25px
- Background: White
- Shadow: 0 4px 20px rgba(0,0,0,0.08)
- Avatar: 60px circle, 3px white border
- Name: 19.2px, 700 weight
- Role: 14.4px, gray color
- Review: 17px, italic, 1.8 line-height

**Investment Card**
- Padding: 40px
- Border radius: 25px
- Icon: 64px emoji
- Stats table: 3 rows, label + value
- Border: 2px transparent → primary on hover

### Button Styles

**Primary Button**
- Background: Gradient 1
- Padding: 19.2px vertical, 48px horizontal
- Border radius: 50px
- Font: 17.6px, 700 weight
- Shadow: 0 10px 30px rgba(99,102,241,0.3)
- Hover: Scale 1.05, shadow increases
- Active: Scale 0.95

**Secondary Button**
- Border: 2px solid dark
- Background: Transparent
- Same padding as primary
- Hover: Fill with dark, text white

**Outlined Button (Login)**
- Border: 2px solid primary
- Background: Transparent
- Text: Primary color
- Hover: Fill with primary, text white

### Stat Cards

**Structure**
- Padding: 24px 32px
- Border radius: 20px
- Background: White
- Shadow: 0 4px 20px rgba(0,0,0,0.08)
- Icon: 32px, primary color
- Number: 32px, 800 weight, dark color
- Label: 14.4px, 500 weight, gray

**Hover Effect**
- Translate Y: -8px
- Shadow: 0 10px 30px rgba(0,0,0,0.1)

### Comparison Table

**Header Row**
- Background: Dark (#0F172A)
- Color: White
- Padding: 24px
- Border radius: 15px top corners
- Font: 17.6px, 700 weight

**Data Rows**
- Background: White
- Padding: 24px
- Border bottom: 1px rgba(0,0,0,0.05)
- Hover: Background light blue, slide 5px right

**Columns**
- Feature: Left-aligned, 600 weight
- Us: Center, gradient text, 700 weight
- Them: Center, gray, 400 weight

## 🎭 Animation Specifications

### Scroll Animations (using Framer Motion)

**Standard Entry**
```javascript
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
viewport={{ once: true }}
```

**Staggered Children**
```javascript
// Parent
initial="hidden"
whileInView="show"
variants={{
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}

// Child
variants={{
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}}
```

**Floating Animation**
```javascript
animate={{ 
  y: [0, -20, 0],
  rotate: [0, 5, 0, -5, 0]
}}
transition={{ 
  duration: 6,
  repeat: Infinity,
  ease: "easeInOut"
}}
```

### Hover Animations

**Card Lift**
```javascript
whileHover={{ 
  y: -10, 
  boxShadow: '0 20px 40px rgba(0,0,0,0.12)' 
}}
```

**Button Scale**
```javascript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

**Icon Spin (optional)**
```javascript
whileHover={{ rotate: 360 }}
transition={{ duration: 0.5 }}
```

### Background Animations

**Gradient Orbs**
```css
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(20px, 10px) scale(1.05); }
}

animation: float 20s infinite ease-in-out;
```

## 📐 Layout Specifications

### Grid Systems

**Feature Grid (What It Is, Benefits)**
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 32px;
```

**Testimonial Grid**
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
gap: 32px;
```

**Footer Grid**
```css
display: grid;
grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
gap: 64px;

/* Mobile */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 40px;
}
```

### Container Widths

```css
.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

/* Mobile */
@media (max-width: 768px) {
  padding: 0 16px;
}
```

### Section Spacing

```css
section {
  padding: 128px 32px; /* Desktop */
}

@media (max-width: 768px) {
  padding: 80px 16px; /* Mobile */
}
```

## 🖼️ Image & Icon Guidelines

### Icons
- **Source**: Feather Icons (via React Icons)
- **Size**: 24px standard, 32px large, 16px small
- **Color**: Primary or contextual (success, accent)
- **Style**: Outline style, 2px stroke width

### Illustrations
- **Phone Mockup**: 300x600px, dark frame, light screen
- **Emoji Icons**: 64px for main feature icons
- **Avatar Placeholders**: 60px circles with emoji

### Shadows

**Light Shadow (cards)**
```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
```

**Medium Shadow (hover)**
```css
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
```

**Heavy Shadow (CTA buttons)**
```css
box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
```

**Colored Shadow (gradient buttons)**
```css
box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
```

## 📱 Responsive Breakpoints

### Desktop First Approach

```css
/* Desktop: Default styles (1400px+) */
/* No media query needed */

/* Laptop */
@media (max-width: 1399px) {
  /* Reduce spacing, adjust grid columns */
}

/* Tablet */
@media (max-width: 1024px) {
  /* 2-column grids, reduce font sizes */
}

/* Mobile */
@media (max-width: 768px) {
  /* Single column, stack elements, larger touch targets */
}

/* Small Mobile */
@media (max-width: 480px) {
  /* Further reduced spacing, smaller fonts */
}
```

### Touch Targets (Mobile)

```css
/* Minimum 44x44px for tappable elements */
button, a.nav-link {
  min-height: 44px;
  min-width: 44px;
}
```

## 🎯 Design Principles

1. **Hierarchy**: Clear visual hierarchy with size, weight, color
2. **Whitespace**: Generous spacing for breathing room
3. **Consistency**: Reusable components, consistent patterns
4. **Accessibility**: High contrast, readable fonts, proper sizes
5. **Performance**: Optimized animations, lazy loading
6. **Mobile-First Thinking**: Touch-friendly, readable on small screens

## 🔄 Design Iteration Process

1. **Wireframe**: Low-fidelity structure
2. **High-Fidelity**: Add colors, typography, spacing
3. **Interactive Prototype**: Add animations, transitions
4. **Responsive Variants**: Design for all breakpoints
5. **Development Handoff**: Component specs, design tokens

---

**Created for Stake Your Habit Landing Page**
**Figma File Structure**: Organize by sections, use components, maintain design system
