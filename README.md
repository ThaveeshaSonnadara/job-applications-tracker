# 🚀 Job Applications Tracker (by Thaveesha Sonnadara)

A full-stack job application tracker with AI-assisted form answering, tailored interview preparation, and document management. Built for tracking Associate Software Engineer, Software Engineer, and Internship applications in Sri Lanka and globally.

---

## ✨ Features

- 📊 **Interactive Dashboard:** Real-time application metrics, conversion funnel visualization, and recent activities.
- 🎯 **AI Form Answer Generator:** Generates personalized, natural, and human-sounding answers to application form questions using your full profile, degree background, MarketPushApps internship experience, and projects. Individual and batch copy buttons.
- 🧠 **Tailored Interview Prep:** Generates categorized interview questions (Technical, Behavioral, Company-Specific) with suggested talking points as you. Track your practice progress per company.
- 📁 **Document Manager:** Previews and one-click downloads for your CV, Westminster Degree Transcript, MarketPushApps Internship Letter, Birth Certificate, and GCE A/L & O/L Results.
- 📈 **Analytics & Insights:** Status distribution, channel success metrics (LinkedIn, TopJobs, Direct Email, Rooster.Jobs), and most in-demand skills in your target roles.
- 🛡️ **Zero Cloud DB Setup:** Powered by local SQLite + Prisma ORM. Fast, lightweight, and private on your machine.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **AI Engine:** OpenRouter API (supports free models such as DeepSeek R1, Llama 3.1, Gemma 2)
- **Styling:** Custom Dark-Themed CSS Design System with Glassmorphism, Micro-Animations & Google Fonts Inter
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Configure OpenRouter API Key
Open `.env.local` inside `app/` and add your free OpenRouter API key:
```env
OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
AI_MODEL=deepseek/deepseek-r1-0528:free
```
*(Get a free key from [openrouter.ai](https://openrouter.ai) with Google Login — no credit card required)*

### 2. Run Database Migrations
```bash
npx prisma db push
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Document Guidelines for Sri Lankan Applications

| Document | When to Submit |
| :--- | :--- |
| **CV - Thaveesha Sonnadara [SE].pdf** | Always attach to every application |
| **Degree Transcript Screenshot.png** | When asked for university transcript / proof of degree |
| **Internship Confirmation Letter.pdf** | When asked for proof of experience / service letter |
| **Birth Certificate Original.pdf** | When required for HR onboarding / ID verification |
| **GCE A/L & O/L Results Schedules** | **Only when explicitly requested** by the employer |
