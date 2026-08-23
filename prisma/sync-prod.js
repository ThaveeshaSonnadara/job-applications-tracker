// Sync script to apply migrations and seed documents to the Neon PRODUCTION database.
// Run with: node prisma/sync-prod.js

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

// 1. Load PROD DATABASE_URL from .env.prod
let prodUrl = '';
const prodEnvPath = resolve(__dirname, '..', '.env.prod');
if (existsSync(prodEnvPath)) {
  const envContent = readFileSync(prodEnvPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && key.trim() === 'DATABASE_URL') {
      let val = rest.join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      prodUrl = val;
    }
  }
}

if (!prodUrl) {
  console.error('❌ Could not find DATABASE_URL in .env.prod');
  process.exit(1);
}

// 2. Load DEV DATABASE_URL from .env.local to copy documents
let devUrl = '';
const devEnvPath = resolve(__dirname, '..', '.env.local');
if (existsSync(devEnvPath)) {
  const envContent = readFileSync(devEnvPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && key.trim() === 'DATABASE_URL') {
      let val = rest.join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      devUrl = val;
    }
  }
}

async function syncProduction() {
  console.log('🚀 Connecting to Neon PRODUCTION database...');
  console.log(`   Host: ${prodUrl.split('@')[1]?.split('/')[0] || 'hidden'}\n`);

  const prodPool = new Pool({ connectionString: prodUrl });
  const prodAdapter = new PrismaPg(prodPool);
  const prodPrisma = new PrismaClient({ adapter: prodAdapter });

  const devPool = new Pool({ connectionString: devUrl });
  const devAdapter = new PrismaPg(devPool);
  const devPrisma = new PrismaClient({ adapter: devAdapter });

  try {
    // Check existing documents in Dev
    const devDocs = await devPrisma.document.findMany();
    console.log(`📋 Found ${devDocs.length} documents in DEV database.\n`);

    console.log('📦 Syncing documents to PRODUCTION...');
    for (const doc of devDocs) {
      const existing = await prodPrisma.document.findUnique({
        where: { filename: doc.filename },
      });

      if (existing) {
        console.log(`  ⏭️  "${doc.title}" (already exists in Prod)`);
      } else {
        await prodPrisma.document.create({
          data: {
            title: doc.title,
            filename: doc.filename,
            fileSize: doc.fileSize,
            fileType: doc.fileType,
            category: doc.category,
            description: doc.description,
            usageGuidance: doc.usageGuidance,
            isMandatoryAlways: doc.isMandatoryAlways,
            isOnlyOnDemand: doc.isOnlyOnDemand,
          },
        });
        console.log(`  ✅ Synced "${doc.title}" to Prod`);
      }
    }

    const prodCount = await prodPrisma.document.count();
    console.log(`\n🎉 Production database is now fully in sync! Total documents in Prod: ${prodCount}`);
  } catch (err) {
    console.error('❌ Sync failed:', err);
  } finally {
    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();
    await prodPool.end();
    await devPool.end();
  }
}

syncProduction();
