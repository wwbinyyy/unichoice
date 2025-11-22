# UniChoice AI Design Guidelines

## Design Approach
**Reference-Based with System Foundation**: Drawing inspiration from premium product design (Apple/Google standards) with custom glassmorphism aesthetic. The application is experience-focused with high visual impact for a competitive university selection platform.

## Visual Identity

### Color System
- **Background**: `#0F1115` with subtle noise texture overlay
- **Primary Gradient**: `linear-gradient(45deg, #6C47FF, #9D4CFF)` for CTAs, highlights, and premium elements
- **Accent**: `#33C8FF` (electric blue) for high-value interactive elements and notifications
- **Text Hierarchy**: 
  - Primary: `#FFFFFF` (pure white)
  - Secondary: `#E6E6E6` (off-white)
  - Body: `rgba(255,255,255,0.7-0.8)` (70-80% opacity)
- **Surface Treatment**: `rgba(255,255,255,0.06-0.12)` with `backdrop-filter: blur(28px)` for glassmorphic cards and panels
- **Shadows**: Multi-layer soft shadows for atmospheric depth

### Typography
- **Primary Font**: Inter (with SF Pro Display as alternative)
- **Headline**: Extra-bold, 48-64px (responsive scaling)
- **Subtitles/Section Headers**: Medium weight, 20-28px
- **Body Text**: Regular weight, 16-18px
- **Line Height**: 1.6 for body text, 1.2 for headlines
- **Letter Spacing**: Slightly increased for headlines (-0.02em), normal for body

### Spacing System
Use Tailwind units: **4, 8, 12, 16, 24, 32** for consistent rhythm
- Card padding: `p-8` (32px)
- Section spacing: `py-24` desktop, `py-16` mobile
- Element gaps: `gap-8` for grids, `gap-4` for inline elements

## Component Library

### University Cards
- **Layout**: Glass container with rounded-3xl (28px border radius)
- **Structure**: Logo (64px), University name (text-xl font-semibold), Location (text-sm opacity-70), Ranking badge (gradient background), Tuition display, Major chips (pill-shaped, subtle borders)
- **Hover State**: Lift effect (translateY -8px), glow enhancement, backdrop blur increase
- **Grid**: 3-4 columns desktop, 2 columns tablet, 1 column mobile

### Search & Filters
- **Search Bar**: Large, prominent with frosted glass background, gradient border on focus, auto-complete dropdown with glassmorphic surface
- **Filter Sidebar**: Sticky panel with glass background, collapsible sections, range sliders with gradient track, multi-select checkboxes with custom styling
- **Sort Controls**: Dropdown with smooth animations, gradient indicator for active sort

### Navigation
- **Desktop**: Horizontal nav with glass background, sticky on scroll with blur increase
- **Mobile**: Bottom navigation bar (fixed) with gradient active indicators
- **Logo**: Prominent placement, possible gradient text treatment

### AI Advisor Panel
- **Position**: Fixed bottom-right
- **Visual**: Glowing orb with pulsing gradient animation
- **Expanded State**: Glass panel (400px width) with chat interface, gradient message bubbles for AI responses
- **Trigger**: Animated entrance on page load (subtle bounce)

### Comparison Table
- **Layout**: Side-by-side grid (up to 4 universities), sticky header row
- **Highlighting**: Gradient background for best values in each category
- **Responsive**: Horizontal scroll on mobile, full width on desktop

## Animations & Interactions
- **Micro-interactions**: 
  - Button hover: Glow effect (box-shadow with gradient colors)
  - Card hover: Lift (transform translateY -8px) + blur shift
  - Input focus: Gradient border animation
- **Page Transitions**: 250ms ease-out fade-slide
- **Loading States**: Gradient shimmer effect on skeleton screens
- **Scroll Behavior**: Smooth scroll, parallax effects minimal (hero section only)

## Layout Architecture
- **Container**: Max-width 1440px (max-w-7xl), centered
- **Grid System**: CSS Grid with responsive columns
- **Hero Section**: Full viewport height (100vh) with gradient overlay, centered content
- **Content Sections**: Generous vertical spacing (py-24), alternating layouts for visual interest

## Accessibility
- WCAG AA contrast compliance (white on dark background meets standards)
- Focus indicators: Gradient outline on interactive elements
- Keyboard navigation support throughout
- Screen reader friendly labels

## Images
- **Hero Section**: Large background image (university campus/students) with dark gradient overlay (to maintain text readability)
- **University Detail Pages**: Banner image (1200x400px) with frosted overlay for text content
- **Placeholder Strategy**: Use university logos via Clearbit API, fallback to gradient placeholder
- **Icons**: Use Heroicons (outline style) via CDN for consistency

## Responsive Breakpoints
- **Mobile**: < 768px (single column, bottom nav, modal filters)
- **Tablet**: 768-1024px (2 columns, condensed spacing)
- **Desktop**: > 1024px (full grid, sidebar filters, all features visible)