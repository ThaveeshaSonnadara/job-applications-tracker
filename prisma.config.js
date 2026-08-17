const { defineConfig } = require("prisma/config");
const { resolve } = require("path");
const { readFileSync } = require("fs");

const envPath = resolve(__dirname, ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && !key.startsWith("#")) {
    let val = rest.join("=").trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key.trim()] = val;
  }
}

module.exports = defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL },
});
