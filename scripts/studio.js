const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

// Gunakan DIRECT_URL (Port 5432 / Session Mode) untuk Prisma Studio
// agar query relations dan pagination tidak terputus oleh PgBouncer Transaction Pooler (Port 6543)
if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
  console.log("ℹ️  Prisma Studio diarahkan ke DIRECT_URL (Session Pooler Port 5432).");
}

try {
  execSync("npx prisma studio", { stdio: "inherit", env: process.env });
} catch (err) {
  process.exit(err.status || 1);
}
