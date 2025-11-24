# Stake Your Habit - Landing Page

A modern, responsive landing page for a habit-building app that uses financial incentives, AI verification, and gamification.

## 🎨 Design System

### Color Palette

```css
Primary: #6366F1 (Indigo) - Trust & Technology
Secondary: #EC4899 (Pink) - Energy & Motivation
Accent: #F59E0B (Gold) - Wealth & Achievement
Dark: #0F172A (Slate) - Professional depth
Light: #F8FAFC - Clean background
Gray: #64748B - Supporting text
Success: #10B981 - Positive actions
```

### Gradients
- **Gradient 1**: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)` - Primary brand
- **Gradient 2**: `linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)` - Call-to-action
- **Gradient 3**: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` - Dark sections

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800, 900
- **Headings**: 800-900 weight for impact
- **Body**: 400-500 for readability

## 📐 Figma Design Breakdown

### Navigation Bar (Sticky)
- **Height**: 80px
- **Background**: Transparent → White (on scroll) with blur effect
- **Logo**: Left-aligned, multi-color wordmark
- **Nav Links**: Horizontal menu with smooth scroll anchors
- **CTA Buttons**: Login (outlined) + Sign Up (gradient filled)
- **Mobile**: Hamburger menu with slide-in navigation

### Hero Section
- **Layout**: Split 50/50 (Content | Visual)
- **Height**: 100vh
- **Elements**: Badge, H1 (4rem), Description, CTA Buttons, Stats Cards, Phone Mockup
- **Animations**: Fade in from bottom (staggered), Floating elements

### What It Is Section
- **Background**: White
- **Layout**: Center-aligned header + 4-column grid
- **Cards**: Hover lift effect, different gradient per card
- **Value Proposition**: Split content + visual with statistics

### How It Works Section
- **Background**: Light gray
- **Layout**: 6-step process cards
- **Elements**: Large step numbers, color-coded icons, challenge examples grid

### Benefits Section
- **Background**: White
- **Layout**: 8-card grid (4 columns desktop)
- **Comparison Table**: 3 columns with sticky header

### Reviews Section
- **Background**: Light with gradient orb
- **Layout**: 6 testimonial cards in grid
- **Stats Showcase**: 4 stats with dividers

### Investment Section
- **Background**: White
- **Layout**: 4 investment options + flow diagram
- **Example Box**: Real user story with calculations

### Footer
- **Background**: Dark with gradient orbs
- **Layout**: 5-column grid
- **Elements**: Brand, Links, Contact, Social icons, Scroll-to-top button

## 🚀 Installation

```bash
cd stake-your-habit
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🎯 Key Features

1. **Smooth Scroll Navigation**: Automatic smooth scrolling to sections
2. **Sticky Navbar**: Transforms on scroll with blur effect
3. **Mobile Responsive**: Fully responsive across all devices
4. **Animated Sections**: Scroll-triggered animations with Framer Motion
5. **Interactive Elements**: Hover effects, floating animations
6. **Performance Optimized**: Lazy loading, viewport-based animations

## 📦 Tech Stack

- React 18
- Framer Motion (animations)
- React Scroll (smooth scrolling)
- React Icons (Feather Icons)
- CSS3 with CSS Variables

## 🎨 Customization

All colors and styles are defined in CSS variables in `App.css`:

```css
:root {
  --primary: #6366F1;
  --secondary: #EC4899;
  --accent: #F59E0B;
  --dark: #0F172A;
  --light: #F8FAFC;
}
```

## 📱 Responsive Breakpoints

- Desktop: 1400px+ (full layout)
- Laptop: 1024px-1399px (adjusted spacing)
- Tablet: 768px-1023px (2-column grids)
- Mobile: <768px (single column, stacked)

## 📊 Available Scripts

### `npm start`
Runs the app in development mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner.

---

**Built for the Jar APM Hackathon** 🚀
