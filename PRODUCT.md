# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Thaveesha Sonnadara — a fresh Software Engineering graduate (BEng Hons, Upper Second Class) from IIT/University of Westminster, based in Mount Lavinia, Colombo, Sri Lanka. Actively applying for Associate Software Engineer, Software Engineer, and Intern Software Engineer roles in Sri Lanka and globally. Immediately available with no notice period.

**Situation:** Conducting a high-volume, multi-channel job search (LinkedIn, TopJobs.lk, Rooster.Jobs, direct email, company websites) while preparing for technical and behavioral interviews. Needs to track every application, generate personalized form answers quickly, practice interview questions tailored to each company, and manage the specific documents Sri Lankan employers request.

**Job to be done:** "Help me apply to more roles with higher quality, less repetitive effort, and zero missed follow-ups — using my actual experience, not generic templates."

## Product Purpose

A **local-first, AI-personalized job application tracker** that eliminates the repetitive drudgery of application forms and interview prep by generating answers and questions *as Thaveesha* — using his real education, MarketPushApps internship, projects, and skills — while keeping all data private on his machine.

**Success means:**
- Applying to more roles per week because form questions take seconds, not minutes
- Walking into interviews already practiced on company-specific questions with talking points drawn from his actual work
- Never losing track of an application status or forgetting a follow-up
- All data stays local (SQLite); no account creation, no cloud database, no vendor lock-in

## Positioning

**AI-first personalization:** Unlike generic trackers (Huntr, Simplify, Teal) or general tools (Notion, Airtable), the AI doesn't just fill templates — it writes *as Thaveesha*. Every generated form answer and interview talking point is grounded in his specific experience: the MarketPushApps React/Figma/Postman workflow, the Room ODD architectural platform with Framer Motion, the ViprWatch ML/Firebase/AWS mobile app, the Upper Second Class Honours degree. The AI knows his voice (contractions, varied sentence length, "So", "Honestly", "ready to start immediately") and never uses corporate speak like "leverage" or "spearhead."

**Secondary differentiators that reinforce the core:**
- **Sri Lankan context built in:** Pre-configured sources (TopJobs, Rooster.Jobs), document requirements (GCE A/L/O/L schedules, birth certificate, internship letter), and salary/location norms
- **Local-first privacy + AI:** SQLite + Prisma on the machine; OpenRouter free-tier models (DeepSeek, Llama, Gemma) for AI — zero cloud database, zero paid API dependency
- **Interview practice as a core loop:** Not an afterthought — generates 15–20 categorized questions (Technical/Behavioral/Company-Specific) with suggested answers per application, tracks practice progress

## Operating Context

**Workflows:**
1. **Discover & Save:** See a role → add to tracker with source, tech stack, job description
2. **Apply with AI:** Open application form → paste questions → get personalized answers in Thaveesha's voice → copy/paste/submit
3. **Prep Interview:** When status reaches INTERVIEW_CALLED or PHONE_CALL → generate company-specific questions → practice with suggested answers → mark practiced
4. **Track & Follow Up:** Dashboard pipeline shows conversion funnel; analytics reveal channel effectiveness and in-demand skills
5. **Manage Documents:** One-click preview/download of the 6 verified documents Sri Lankan employers request

**Environment:** Desktop browser (primary), mobile browser (secondary for quick status checks). Runs locally via `npm run dev` at `http://localhost:3000`.

**Documents (factual, never fabricated):**
- CV — Thaveesha Sonnadara [SE].pdf
- Degree Transcript Screenshot.png
- MarketPushApps Internship Confirmation Letter.pdf
- Birth Certificate Original.pdf
- GCE (Advanced Level) Results Schedule.pdf
- GCE (Ordinary Level) Results Schedule.pdf

**Rituals:** Daily dashboard check → weekly analytics review → per-application interview prep when status advances.

## Capabilities and Constraints

**Confirmed capabilities:**
- Full CRUD for applications (company, role, source, status, dates, salary, location, work mode, notes, required tech, contacts, documents)
- 8-stage pipeline: SAVED → APPLIED → INTERVIEW_CALLED → PHONE_CALL → EMAIL_RESPONSE → OFFERED / REJECTED / WITHDRAWN
- AI form answer generation (batch + individual copy) via OpenRouter free models
- AI interview question generation (15–20 per application, 3 categories, 3 difficulties, practice tracking)
- Document manager with preview/download for 6 verified files
- Analytics: status distribution, channel success, top required technologies
- Dark-themed glassmorphism UI with gradient accents, micro-animations, responsive sidebar navigation
- Prisma + SQLite (Better-SQLite3 adapter) — zero setup, fully local

**Technical constraints:**
- **Platform:** Next.js 15 (App Router), React 19, TypeScript
- **Database:** SQLite only — no PostgreSQL, no cloud DB, no migration to other engines planned
- **AI:** OpenRouter API only — free models (DeepSeek R1, Llama 3.1, Gemma 2); no paid model assumption; `OPENROUTER_API_KEY` required in `.env.local`
- **Auth:** None — single-user, no login, no multi-tenancy
- **Deployment:** Local development only; no Vercel/Netlify/Docker config present
- **Styling:** Vanilla CSS with custom properties (design tokens) — no Tailwind, no CSS-in-JS, no component library

**Terminology:**
- "Application" = one job application row (not the whole app)
- "Pipeline" = the 5-status conversion funnel (SAVED through OFFERED)
- "Channel" / "Source" = where the role was found (LINKEDIN, TOPJOBS, etc.)
- "Practiced" = interview question marked as reviewed

**Explicitly undecided:**
- Whether to add export/backup (CSV, JSON) for the SQLite data
- Whether to add reminder/notifications for follow-ups
- Whether to support multiple user profiles on one machine

## Brand Commitments

**Name:** JobTracker (displayed in sidebar logo)
**Attribution:** "by Thaveesha" (sidebar subtitle)
**Voice:** First-person, conversational, enthusiastic but genuine — "I've built...", "What really excites me...", "Honestly, the part I enjoyed most..." — never corporate, never generic
**Visual identity (incumbent, not prescriptive):** Dark theme, purple/blue/teal gradient primary, glassmorphism cards, Inter font, Lucide icons. The logo mark is a ✨ sparkle.

**No external brand assets** (no logo files, no style guide, no marketing site). This is a personal tool; the brand lives in the code and the AI's writing voice.

## Evidence on Hand

**Real content (do not fabricate):**
- 6 verified documents in `public/documents/`
- Complete profile in `src/lib/profile.ts` (education, 1 internship, 10 projects, tech skills, soft skills, GitHub stats)
- Type definitions for all domain entities in `src/types/index.ts`
- AI prompts encoded with Thaveesha's actual voice rules in `src/lib/ai.ts`

**Absences that future work must not invent:**
- No testimonials, no case studies, no "users love this" claims
- No team members, no company backing, no funding
- No deployment URL, no public demo, no analytics beyond local SQLite
- No paid AI model benchmarks — only free-tier OpenRouter models

## Product Principles

1. **Privacy by architecture** — Data never leaves the machine unless Thaveesha explicitly sends it to OpenRouter. No telemetry, no sync, no accounts.
2. **AI as ghostwriter, not oracle** — The AI writes *as* Thaveesha using his facts. It doesn't hallucinate experience; it surfaces what's already in the profile. Every generated answer is editable before use.
3. **Sri Lankan context is default, not optional** — Sources, documents, and norms are pre-configured for the local market. Global roles work too, but the home context requires zero setup.
4. **Interview prep is a first-class loop** — Not a feature tucked away. Questions generate automatically when status advances; practice state persists; suggested answers are grounded in real projects.
5. **Local-first means portable** — Copy the folder, run `npm install && npx prisma db push && npm run dev` — it works. No Docker, no env secrets beyond one API key, no cloud dependencies.

## Accessibility & Inclusion

Standard WCAG 2.1 AA for web: semantic HTML, focus states, color contrast (verified in dark theme), keyboard navigation, screen-reader labels on interactive elements. No product-specific accessibility requirements beyond the baseline — this is a personal tool for one known user with no disclosed disabilities.