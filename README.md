# 🚀 Job Applications Tracker

A polished full-stack job application tracker with AI-assisted form answering, tailored interview preparation, dynamic document management, and secure admin/public dual-mode view. Built for tracking Software Engineer, Associate SE, and Internship applications across Sri Lanka and globally.

> **Live Demo:** [https://job-applications-tracker-gules.vercel.app](https://job-applications-tracker-gules.vercel.app) _(deploy your own below)_

---

## ✨ Features at a Glance

| Feature                                   | Description                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 📊 **Interactive Dashboard**              | Real-time metrics, conversion funnel, pipeline bar, recent activity feed                                |
| 🔒 **Admin & Public Portfolio Mode**      | Public visitors see a clean read-only showcase; admin logs in via `/admin` to unlock all privileged actions |
| 🎯 **AI Form Answer Generator** (Admin)   | Personalized, human-sounding answers using your full profile, degree, internship & projects             |
| 🧠 **Tailored Interview Prep** (Admin)    | Categorized questions (Technical, Behavioral, Company-Specific) with talking points & practice tracking |
| ⚡ **AI Job URL Extraction** (Admin)      | Extract company name, role, requirements, and job description directly from job posting URLs            |
| 📁 **Dynamic Document Manager**           | Database-backed document portfolio with public previews/downloads & admin-only Upload, Edit & Delete   |
| 📈 **Analytics & Insights**               | Status distribution, channel success metrics, in-demand skills radar                                    |
| 🛡️ **Server-Side Security & Redaction**  | Timing-safe auth tokens, API endpoint protection, and server-side redaction of confidential AI data      |
| ☁️ **Cloud-Native PostgreSQL**            | Neon serverless DB with zero local setup, automated migrations, and instant Vercel integration          |

---

## 🔒 Public Portfolio vs. Admin Mode

The application is designed to be shared publicly as an interactive career tracker and portfolio while keeping private application details secure:

- **Public Visitors (Default):**
  - View overall application statistics, conversion analytics, and portfolio documents.
  - One-click document preview in new tab and direct download.
  - Browse applications with non-editable status indicators.
  - Confidential AI answers, interview preparation, delete buttons, and creation forms are completely hidden and redacted server-side from API responses.
- **Admin Mode (Unlocked via `/admin`):**
  - Add, update, and delete applications.
  - Auto-extract job details from application URLs using AI.
  - Generate personalized form answers and custom interview preparation talking points.
  - **Upload, edit, and delete documents** directly through the UI with drag-and-drop file upload, auto-title generation, and custom category pickers.
  - Fast status transitions with automatic timestamping.

---

## 📸 Screenshots

### Main Dashboard

![Dashboard Overview](docs/dashboard-overview.png)

### Applications Management

![Applications Page](docs/applications-page.png)

### Add New Application (with AI URL Extraction)

![Add New Application Page](docs/add-new-application-page.png)

### Analytics & Insights

![Analytics Page](docs/analytics-page.png)

---

## 🛠️ Tech Stack

| Layer          | Technology                                                             |
| -------------- | ---------------------------------------------------------------------- |
| **Framework**  | Next.js 16 (App Router, Turbopack)                                     |
| **Language**   | TypeScript 5                                                           |
| **Database**   | PostgreSQL (Neon serverless) + Prisma ORM                              |
| **Security**   | Secure HTTP-only cookies, timing-safe crypto comparison, server-side data redaction |
| **AI**         | OpenRouter API (DeepSeek, Llama, Nemotron, Gemma)                      |
| **Styling**    | Custom CSS Design System — Modern light dashboard, DM Sans typography, Blue palette |
| **Icons**      | Lucide React                                                           |
| **Deployment** | Vercel (zero-config)                                                   |

---

## 🚀 Deploy Your Own (2 minutes)

### 1. Prerequisites

- **GitHub account** — [github.com](https://github.com)
- **Neon account** (free) — [console.neon.tech](https://console.neon.tech)
- **OpenRouter API key** (free) — [openrouter.ai](https://openrouter.ai)
- **Vercel account** — [vercel.com](https://vercel.com)

### 2. Neon Database (30 sec)

1. Create project → name it `job-tracker`
2. **Main branch** → Copy **Pooled connection** → save for Vercel
3. **Dev branch** → Create branch `dev` → Copy **Direct connection** → save for local

### 3. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ThaveeshaSonnadara/job-applications-tracker)

Or manually:

1. Fork this repo → `github.com/YOUR_USERNAME/job-applications-tracker`
2. **Vercel** → "Add New Project" → Import fork
3. **Environment Variables:**
   ```env
   DATABASE_URL=postgresql://...pooler... (Neon MAIN branch Pooled)
   OPENROUTER_API_KEY=sk-or-v1-...
   AI_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
   ADMIN_PASSWORD=your-secure-admin-password
   ```
4. Deploy → Runs migration automatically

### 4. Local Development & Sync

```bash
git clone https://github.com/ThaveeshaSonnadara/job-applications-tracker.git
cd job-applications-tracker/app

# .env.local - use Neon DEV branch Direct connection
DATABASE_URL="postgresql://... (dev branch Direct)"
OPENROUTER_API_KEY=sk-or-v1-...
AI_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
ADMIN_PASSWORD="your-local-admin-password"

npm install
npx prisma migrate dev --name init
node prisma/seed-documents.js   # Seed default document portfolio into Dev DB
node prisma/sync-prod.js        # (Optional) Sync documents to Production DB
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and visit [http://localhost:3000/admin](http://localhost:3000/admin) to log in as admin.

---

## 📁 Project Structure

```
app/
├── prisma/
│   ├── schema.prisma          # Data models (Application, Document, Answers, Questions)
│   ├── migrations/            # SQL migrations history
│   ├── seed-documents.js      # Document seed script for initial migration
│   ├── sync-prod.js           # Production database document sync script
│   └── config.js              # Prisma configuration & dynamic env loader
├── public/
│   └── documents/             # Uploaded PDF and image documents
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard (Stats, Funnel, Recent apps)
│   │   ├── admin/page.tsx     # Admin authentication login & session management
│   │   ├── analytics/page.tsx # Analytics & visual insights
│   │   ├── applications/      # Applications CRUD & detail views
│   │   │   ├── page.tsx       # Applications list & search/filtering
│   │   │   ├── new/page.tsx   # Add application form with AI extraction (Admin)
│   │   │   └── [id]/          # Application detail
│   │   │       ├── page.tsx   # Status, overview, notes, contact details
│   │   │       ├── answers/   # AI Form Answer generator (Admin)
│   │   │       └── interview/ # Tailored interview prep (Admin)
│   │   ├── documents/page.tsx # Document manager (Public view & Admin Upload/Edit/Delete)
│   │   └── api/               # Protected API routes
│   │       ├── auth/          # Login, logout, and session check
│   │       ├── applications/  # Application CRUD (Protected POST/PUT/DELETE)
│   │       ├── documents/     # Document listing & Upload/Edit/Delete (Admin-only mutations)
│   │       ├── ai/            # AI generation endpoints (Admin-only)
│   │       └── interview/     # Interview question status (Admin-only)
│   ├── components/
│   │   └── Sidebar.tsx        # Navigation sidebar with role-aware items
│   ├── lib/
│   │   ├── admin.tsx          # Client-side admin auth context & useAdmin hook
│   │   ├── admin-auth.ts      # Server-side token validation & timing-safe checks
│   │   ├── db.ts              # Prisma client instance
│   │   ├── ai.ts              # OpenRouter AI prompts & web scraper
│   │   └── utils.ts           # Date formatting & UI helpers
│   └── globals.css            # Custom CSS design system tokens & animations
├── DESIGN.md                  # Full design specification
└── PRODUCT.md                 # Product context
```

---

## 📝 Official Document Portfolio

| Document                                                                                | Category     | When to Submit                                              |
| --------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------- |
| **CV - Thaveesha Sonnadara [SE].pdf**                                                   | Core         | **Always attach** to every application & submission         |
| **Thaveesha Sonnadara Internship confirmation letter.pdf**                              | Core         | When proof of past work experience / service letter needed  |
| **University Degree Certificate — BEng (Hons) Software Engineering**                   | Academic     | Proof of degree graduation & certified qualification        |
| **Official Degree Confirmation of Award Letter**                                        | Academic     | Verification of award conferral from university             |
| **Official University Degree Academic Transcript**                                      | Academic     | When modular mark breakdowns, GPA, or transcripts needed    |
| **Birth Certificate (Original)**                                                        | Identity     | HR onboarding, employment contract, or identity verification|
| **G.C.E. Advanced Level Results Schedule**                                              | School Exam  | Only when explicitly requested by HR or application portal   |
| **G.C.E. Ordinary Level Results Schedule**                                              | School Exam  | Only when explicitly requested by HR or application portal   |

---

## 🎨 Design System Highlights
- **Brand Palette:** Deep Blue (`#0069A4`) → Vibrant Azure (`#1281C3`) with soft `#F5FBFF` canvas and `#EAF1F8` secondary surfaces
- **Data-Forward Dashboard:** Clean white cards with crisp borders and subtle elevations
- **Custom Category Pickers:** Interactive dropdowns with color-coded badges (`Briefcase` Core, `GraduationCap` Academic, `ShieldCheck` Identity, `Award` School Exam)
- **Semantic Badges:** 8 status states with high-contrast labels and soft pill tints
- **Typography:** DM Sans (700 headings, 600 labels, 400 body) + JetBrains Mono
- **Motion:** Micro-interactions, smooth transitions, reduced-motion accessibility support

See [DESIGN.md](DESIGN.md) for full specification.

---

## 📄 License

MIT — feel free to use, modify, and deploy for your own job search.

---

**Built with care by [Thaveesha Sonnadara](https://github.com/ThaveeshaSonnadara)** — tracking applications so you don't have to.