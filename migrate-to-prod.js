const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const Database = require('better-sqlite3');
require('dotenv').config({ path: '.env.local' });

const PROD_URL = 'postgresql://user:pw@ep-late-feather-az2ttqkv-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sqlite = new Database('prisma/dev.db');
const adapter = new PrismaPg({ connectionString: PROD_URL });
const prisma = new PrismaClient({ adapter });

async function migrate() {
  console.log('📦 Migrating data to Neon PRODUCTION...\n');

  // 1. Run migrations first
  console.log('🔧 Running migrations...');
  // Note: Can't run migrate deploy from here easily, do it via CLI first

  // 2. Migrate Applications
  const apps = sqlite.prepare('SELECT * FROM Application').all();
  console.log(`📋 Found ${apps.length} applications`);

  for (const app of apps) {
    const data = {
      id: app.id,
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      jobUrl: app.jobUrl,
      jobDescription: app.jobDescription,
      companyBackground: app.companyBackground,
      applicationSource: app.applicationSource,
      status: app.status,
      applicationDate: app.applicationDate ? new Date(app.applicationDate) : null,
      responseDate: app.responseDate ? new Date(app.responseDate) : null,
      salary: app.salary,
      location: app.location,
      workMode: app.workMode,
      notes: app.notes,
      requiredTechnologies: app.requiredTechnologies || '',
      contactPerson: app.contactPerson,
      contactEmail: app.contactEmail,
      contactPhone: app.contactPhone,
      documentsAttached: app.documentsAttached || '',
      createdAt: new Date(app.createdAt),
      updatedAt: new Date(app.updatedAt),
    };

    await prisma.application.create({ data });
    console.log(`  ✅ ${app.companyName} — ${app.jobTitle}`);
  }

  // 3. Migrate Generated Answers
  const answers = sqlite.prepare('SELECT * FROM GeneratedAnswer').all();
  console.log(`\n💬 Found ${answers.length} generated answers`);

  for (const ans of answers) {
    await prisma.generatedAnswer.create({
      data: {
        id: ans.id,
        applicationId: ans.applicationId,
        question: ans.question,
        answer: ans.answer,
        createdAt: new Date(ans.createdAt),
      },
    });
  }
  console.log(`  ✅ Migrated ${answers.length} answers`);

  // 4. Migrate Interview Questions
  const questions = sqlite.prepare('SELECT * FROM InterviewQuestion').all();
  console.log(`\n❓ Found ${questions.length} interview questions`);

  for (const q of questions) {
    await prisma.interviewQuestion.create({
      data: {
        id: q.id,
        applicationId: q.applicationId,
        question: q.question,
        suggestedAnswer: q.suggestedAnswer,
        category: q.category,
        difficulty: q.difficulty,
        isPracticed: Boolean(q.isPracticed),
        createdAt: new Date(q.createdAt),
      },
    });
  }
  console.log(`  ✅ Migrated ${questions.length} questions`);

  const count = await prisma.application.count();
  console.log(`\n🎉 Migration complete! Total applications: ${count}`);

  await prisma.$disconnect();
  sqlite.close();
}

migrate().catch(e => {
  console.error('❌ Migration failed:', e);
  process.exit(1);
});
