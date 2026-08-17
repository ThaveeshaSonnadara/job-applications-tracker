const { defineConfig } = require("prisma/config");
const { resolve } = require("path");
const { readFileSync, existsSync } = require("fs");

// Load .env.local for local dev (optional, won't exist in Vercel)
const envPath = resolve(__dirname, ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && !key.startsWith("#")) {
      let val = rest.join("=").trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  }
}

module.exports = defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL },
});
