# UniChoice AI

## Overview

UniChoice AI is a premium web application designed to help students discover and compare universities worldwide. The platform provides comprehensive university data including QS rankings, tuition fees, admission requirements, program strengths, and alumni success stories. Users can search, filter, compare universities side-by-side, and receive AI-powered recommendations through an integrated chatbot advisor.

The application emphasizes a luxurious, futuristic user experience with glassmorphism design, smooth animations, and an intuitive interface that makes university selection effortless and engaging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing instead of React Router
- File-based organization with separation of pages, components, hooks, and utilities

**UI Component System**
- Shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with extensive customization
- Custom design system implementing glassmorphism aesthetic with dark theme (`#0F1115` background)
- Gradient-based primary colors (`#6C47FF` to `#9D4CFF`) and electric blue accent (`#33C8FF`)
- Inter font family for typography with specific weight/size hierarchy
- Reusable components: UniversityCard, SearchBar, FilterSidebar, AIChatbot

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and background updates
- Local state with React hooks for UI interactions
- LocalStorage for comparison list persistence (up to 4 universities)

**Key User Flows**
1. **Home Page**: Hero section → Search/Filter → University grid → Detail view
2. **Search**: Real-time autocomplete with debounced API calls, suggestion dropdown
3. **Filtering**: Multi-dimensional filters (country, tuition range, degree levels, majors, grants) with sticky sidebar on desktop, sheet drawer on mobile
4. **Comparison**: Add universities to comparison list → Side-by-side view with detailed metrics
5. **AI Advisor**: Floating chatbot button → Conversational interface for personalized recommendations

### Backend Architecture

**Runtime & Server**
- Node.js with Express.js framework for RESTful API
- TypeScript throughout the stack for consistency
- Dual-mode server setup: `index-dev.ts` (Vite middleware integration) and `index-prod.ts` (static file serving)
- Development server includes Vite HMR, error overlays, and Replit-specific tooling

**API Design**
- RESTful endpoints following conventional patterns:
  - `GET /api/universities` - Retrieve all universities
  - `GET /api/universities/search?q=` - Search with query parameter
  - `GET /api/universities/:slug` - Single university details
  - `POST /api/chat` - AI chatbot interaction with message history

**Data Storage Strategy**
- In-memory storage implementation (`MemStorage` class) for university data
- Universities loaded from JSON file at server startup (`universities_enhanced.json`)
- No persistent database required - read-only data model
- Search functionality implemented with JavaScript string matching (case-insensitive)
- Future-ready interface (`IStorage`) allows migration to Drizzle ORM + PostgreSQL without API changes

**Database Configuration (Prepared but Unused)**
- Drizzle ORM configured for PostgreSQL via Neon serverless driver
- Schema defined in `shared/schema.ts` with Zod validation
- Migration setup exists but data currently served from static JSON
- Environment variable `DATABASE_URL` expected for future database integration

### Design System Implementation

**Glassmorphism Aesthetic**
- Semi-transparent surfaces with backdrop blur (`rgba(255,255,255,0.06-0.12)` with `blur(28px)`)
- Layered shadows for atmospheric depth
- Rounded corners (16-28px, specified as `rounded-3xl` in Tailwind)
- Hover effects with elevation changes (`translateY -8px`, glow enhancement)

**Responsive Design**
- Mobile-first approach with breakpoint-specific layouts
- Desktop: 3-4 column university grid, sticky filter sidebar
- Tablet: 2 column grid, collapsible filters
- Mobile: Single column, bottom sheet filters, optimized navigation
- Custom hook `useIsMobile()` for viewport detection

**Animation System**
- Micro-interactions on hover/active states
- 250ms transition duration for smooth state changes
- Framer Motion not used - relying on CSS transitions and Radix UI animations
- Card lift effects, blur shifts, gradient text on hover

### External Dependencies

**Third-Party UI Libraries**
- Radix UI primitives (20+ components): Accessibility-first headless components for dialogs, dropdowns, accordions, tooltips, etc.
- Embla Carousel for potential carousel implementations
- Lucide React for icon system (replacing Heroicons/Feather)
- `cmdk` for command palette functionality
- `class-variance-authority` and `clsx`/`tailwind-merge` for dynamic className composition

**AI Integration**
- OpenAI API (GPT-5 model configured as default)
- Chat completion endpoint for conversational AI advisor
- System prompt engineered for university recommendation expertise
- Error handling for missing API key configuration (graceful degradation with user notification)
- Message history maintained client-side for contextual conversations

**Development Tools**
- Replit-specific plugins: Cartographer (code mapping), dev banner, runtime error modal
- TSX for TypeScript execution in development
- ESBuild for production server bundling
- Drizzle Kit for database migrations (when needed)

**Data Sources**
- QS World University Rankings 2025 data
- 1000+ universities with enhanced metadata (tuition in USD, international student percentages, rankings)
- Alumni case studies and success stories
- Logo URLs via Clearbit API

**Deployment Considerations**
- Build process: Vite builds client → ESBuild bundles server → Combined dist output
- Production server serves static files from `dist/public`
- Environment variables required: `DATABASE_URL` (if using DB), `OPENAI_API_KEY` (for AI features)
- No session management or authentication currently implemented