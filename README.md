# 🚀 Job Applications Tracker

A polished full-stack job application tracker with AI-assisted form answering, tailored interview preparation, document management, and secure admin/public dual-mode view. Built for tracking Software Engineer, Associate SE, and Internship applications across Sri Lanka and globally.

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
| 📁 **Document Manager**                   | Previews & one-click downloads for CV, transcripts, certificates, results                               |
| 📈 **Analytics & Insights**               | Status distribution, channel success metrics, in-demand skills radar                                    |
| 🛡️ **Server-Side Security & Redaction**  | Timing-safe auth tokens, API endpoint protection, and server-side redaction of confidential AI data      |
| ☁️ **Cloud-Native PostgreSQL**            | Neon serverless DB — zero local setup, works on Vercel instantly                                        |

---

## 🔒 Public Portfolio vs. Admin Mode

The application is designed to be shared publicly as an interactive career tracker and portfolio while keeping private application details secure:

- **Public Visitors (Default):**
  - View overall application statistics, analytics, and document downloads.
  - Browse applications with non-editable status indicators.
  - Confidential AI answers, interview preparation, delete buttons, and creation forms are completely hidden and redacted from API responses.
- **Admin Mode (Unlocked via `/admin`):**
  - Add, update, and delete applications.
  - Auto-extract job details from application URLs using AI.
  - Generate personalized form answers and custom interview preparation talking points.
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

### 4. Local Development

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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and visit [http://localhost:3000/admin](http://localhost:3000/admin) to log in as admin.

---

## 📁 Project Structure

```
app/
├── prisma/
│   ├── schema.prisma          # Data models
│   ├── migrations/            # SQL migrations
│   └── config.js              # Prisma config
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
│   │   ├── documents/page.tsx # Document manager & downloads
│   │   └── api/               # Protected API routes
│   │       ├── auth/          # Login, logout, and session check
│   │       ├── applications/  # Application CRUD (Protected POST/PUT/DELETE)
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
│   └── globals.css            # Custom CSS design system tokens
├── DESIGN.md                  # Full design specification
└── PRODUCT.md                 # Product context
```

---

## 📝 Document Guidelines (Sri Lankan Applications)

| Document                               | When to Submit                  |
| -------------------------------------- | ------------------------------- |
| **CV - Thaveesha Sonnadara [SE].pdf**  | Always attach                   |
| **Degree Transcript Screenshot.png**   | Proof of degree requested       |
| **Internship Confirmation Letter.pdf** | Proof of experience requested   |
| **Birth Certificate Original.pdf**     | HR onboarding / ID verification |
| **GCE A/L & O/L Results**              | Only when explicitly requested  |

---

## 🎨 Design System Highlights
- **Brand Palette:** Deep Blue (`#0069A4`) → Vibrant Azure (`#1281C3`) with soft `#F5FBFF` canvas and `#EAF1F8` secondary surfaces
- **Data-Forward Dashboard:** Clean white cards with crisp borders and subtle elevations
- **Semantic Badges:** 8 status states with high-contrast labels and soft pill tints
- **Typography:** DM Sans (700 headings, 600 labels, 400 body) + JetBrains Mono
- **Motion:** Micro-interactions, smooth transitions, reduced-motion accessibility support

See [DESIGN.md](DESIGN.md) for full specification.

---

## 📄 License

MIT — feel free to use, modify, and deploy for your own job search.

---

**Built with care by [Thaveesha Sonnadara](https://github.com/ThaveeshaSonnadara)** — tracking applications so you don't have to.