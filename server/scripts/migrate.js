require("dotenv").config();

const { execSync } = require("child_process");
const { resolveEnv } = require("../config/config");

const env = resolveEnv();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env;
}

console.log(`[migrate] environment: ${env}`);

if (env === "production" && !process.env.DATABASE_URL) {
  console.error("[migrate] DATABASE_URL is required in production.");
  process.exit(1);
}

try {
  execSync(`npx sequelize-cli db:migrate --env ${env}`, {
    stdio: "inherit",
    env: process.env,
  });
  console.log("[migrate] completed successfully.");
} catch (error) {
  console.error("[migrate] failed:", error.message);
  process.exit(1);
}
