require("dotenv").config();

const { execSync } = require("child_process");
const { resolveEnv } = require("../config/config");

const env = resolveEnv();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env;
}

console.log(`[migrate] environment: ${env}`);
console.log(
  `[migrate] DATABASE_URL set: ${process.env.DATABASE_URL ? "yes" : "no"}`,
);

if (env === "production" && !process.env.DATABASE_URL) {
  console.error(
    "[migrate] DATABASE_URL is required in production. On Railway: add Postgres plugin and use its DATABASE_URL (not a dead Supabase URL).",
  );
  process.exit(1);
}

if (
  process.env.DATABASE_URL &&
  /supabase\.(co|com)|db\.[a-z0-9]+\.supabase/i.test(process.env.DATABASE_URL)
) {
  console.warn(
    "[migrate] DATABASE_URL looks like Supabase. On Railway, prefer the Railway Postgres DATABASE_URL.",
  );
}

try {
  execSync(`npx sequelize-cli db:migrate --env ${env}`, {
    stdio: "inherit",
    env: process.env,
  });
  console.log("[migrate] completed successfully.");
} catch (error) {
  console.error("[migrate] failed:", error.message);
  console.error(
    "[migrate] Deploy will not start until DB is reachable and migrations succeed.",
  );
  process.exit(1);
}
