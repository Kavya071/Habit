# 🎯 StakeYourHabit

> Put your money where your habits are. Build lasting habits through financial commitment.

**Prototype for "Build for Habit" Challenge**

## 🚀 Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 What is this?

A habit-building platform where users stake real money on daily challenges. Complete them → get money back + bonuses. Fail → lose stake to winners.

### Why it works:
- **Loss aversion psychology**: People hate losing money
- **Daily accountability**: Money in escrow = must return
- **Real rewards**: Earn from others' failures
- **Brand partnerships**: Sponsored challenges reduce cost

## 🎨 Features

### 9 Challenge Types
1. 💧 **Hydration** (Bisleri) - Drink 15 glasses daily
2. 📚 **Reading** (Kindle) - Read 30 pages daily
3. 🏃 **Running** (Nike) - Run 5km daily
4. 🚶 **Walking** (Decathlon) - Walk 10,000 steps
5. 📱 **Social Media Detox** (Digital Wellbeing) - Reduce screen time
6. 💻 **DSA Practice** (LeetCode) - Solve 1 problem daily
7. 🗄️ **SQL Practice** (HackerRank) - Solve 1 query daily
8. 🌅 **Early Rise** (Headspace) - Wake at 6 AM
9. 😴 **Early Sleep** (Sleep Foundation) - Sleep by 10 PM

### Key Features
- ✅ 3 difficulty levels (7/21/30 days)
- ✅ Stake ₹500-₹5,000
- ✅ Daily photo proof upload
- ✅ Animated progress tracking
- ✅ Wallet system (balance + escrow)
- ✅ Activity feed & achievements
- ✅ Brand sponsorships
- ✅ Mobile-responsive design

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router v6** - Navigation
- **Framer Motion** - Animations
- **Firebase** - Auth, Firestore, Storage
- **React Icons** - Icon library

## 📱 Pages

1. **Landing** - Hero, features, testimonials
2. **Dashboard** - Active challenges, wallet, activity
3. **Challenges** - Marketplace with filters
4. **Challenge Pages** (x9) - Full detail with progress tracking
5. **Investments** - Portfolio view
6. **Achievements** - Badges & milestones

## 🎯 For Prototype Review

This is a **working prototype** built for the "Build for Habit" challenge. 

📄 **See [PROTOTYPE_SUBMISSION.md](./PROTOTYPE_SUBMISSION.md) for complete details:**
- Problem framing & solution
- Complete user journey
- UX/UI rationale
- Monetization strategy (3 revenue streams)
- Viral growth loops
- Key metric: Challenge Completion Rate (CCR)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Challenges.jsx
│   ├── WaterChallenge.jsx
│   ├── BookChallenge.jsx
│   ├── RunningChallenge.jsx
│   ├── WalkingChallenge.jsx
│   ├── DetoxChallenge.jsx
│   ├── DSAChallenge.jsx
│   ├── SQLChallenge.jsx
│   ├── EarlyRiseChallenge.jsx
│   ├── EarlySleepChallenge.jsx
│   ├── Investments.jsx
│   └── Achievements.jsx
└── firebase.js
```

## 🔐 Firebase Setup

Create `.env.local`:

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 📊 Key Metric

**Challenge Completion Rate (CCR)**: % of challenges completed successfully

- Target: 65%
- Current habit apps: 10-15%
- Our hypothesis: 60-70% (due to financial commitment)

---

## 🎨 Original Design System

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
