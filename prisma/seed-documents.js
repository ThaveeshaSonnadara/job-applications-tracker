// Seed script to migrate existing hardcoded documents into the database.
// Run with: node prisma/seed-documents.js

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && !key.startsWith('#')) {
      let val = rest.join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  }
}

const DOCUMENTS = [
  {
    title: 'Software Engineer CV (Latest)',
    filename: 'CV - Thaveesha Sonnadara [SE].pdf',
    fileSize: '109 KB',
    fileType: 'pdf',
    category: 'Core',
    description:
      'Full Software Engineering CV containing Westminster BEng (Upper Second Honours), 1-year MarketPushApps internship experience, all 5 key projects, and tech stack.',
    usageGuidance: 'Attach this to EVERY application, email inquiry, and job portal submission.',
    isMandatoryAlways: true,
    isOnlyOnDemand: false,
  },
  {
    title: 'Internship Confirmation Letter',
    filename: 'Thaveesha Sonnadara Internship confirmation letter.pdf',
    fileSize: '120 KB',
    fileType: 'pdf',
    category: 'Core',
    description:
      'Official 1-Year Industrial Placement confirmation letter from MarketPushApps (Sep 2024 – Sep 2025).',
    usageGuidance: 'Attach when companies request proof of past work experience or service letters.',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  },
  {
    title: 'University Degree Record & Transcript',
    filename: 'Degree Transcript Screenshot.png',
    fileSize: '125 KB',
    fileType: 'png',
    category: 'Academic',
    description:
      'University of Westminster official student record showing completed BEng (Hons) in Software Engineering with Upper Second Class Honours.',
    usageGuidance: 'Attach when asked for university transcripts, degree certificates, or GPA verification.',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  },
  {
    title: 'Birth Certificate (Original)',
    filename: 'Birth Certificate Original.pdf',
    fileSize: '560 KB',
    fileType: 'pdf',
    category: 'Identity',
    description:
      'Official Sri Lankan government birth certificate for identification and nationality verification.',
    usageGuidance: 'Provide during HR onboarding, employment contract signing, or when explicitly requested.',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  },
  {
    title: 'G.C.E. Advanced Level Results Schedule',
    filename: 'GCE(Advanced Level) Resutls Schedule.pdf',
    fileSize: '879 KB',
    fileType: 'pdf',
    category: 'School Exam',
    description:
      'Physical Science (Combined Mathematics) results schedule from Thurstan College, Colombo.',
    usageGuidance: '⚠️ Only attach if the application form or HR recruiter specifically asks for GCE A/L results.',
    isMandatoryAlways: false,
    isOnlyOnDemand: true,
  },
  {
    title: 'G.C.E. Ordinary Level Results Schedule',
    filename: 'GCE(Ordinary Level) Resutls Schedule.pdf',
    fileSize: '686 KB',
    fileType: 'pdf',
    category: 'School Exam',
    description: 'Official G.C.E. O/L examination results schedule.',
    usageGuidance: '⚠️ Only attach if the application form explicitly asks for GCE O/L results.',
    isMandatoryAlways: false,
    isOnlyOnDemand: true,
  },
];

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding documents...');

  for (const doc of DOCUMENTS) {
    const existing = await prisma.document.findUnique({
      where: { filename: doc.filename },
    });

    if (existing) {
      console.log(`  ⏭️  Skipping "${doc.title}" (already exists)`);
      continue;
    }

    await prisma.document.create({ data: doc });
    console.log(`  ✅ Created "${doc.title}"`);
  }

  console.log('\nDone! All documents seeded.');
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
