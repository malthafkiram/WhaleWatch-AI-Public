require("dotenv").config();

function isLocalDbHost(host = process.env.DB_HOST) {
  if (!host) return false;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("127.") ||
    host.endsWith(".railway.internal")
  );
}

function resolveEnv() {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "test" || nodeEnv === "production" || nodeEnv === "development") {
    return nodeEnv;
  }

  // Railway / hosted platforms (NODE_ENV often unset)
  if (
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.RAILWAY_SERVICE_ID ||
    process.env.RENDER ||
    process.env.FLY_APP_NAME
  ) {
    return "production";
  }

  // DATABASE_URL without local DB host → production config (Railway, Supabase, etc.)
  if (process.env.DATABASE_URL) {
    if (!process.env.DB_HOST || !isLocalDbHost()) {
      return "production";
    }
  }

  return "development";
}

function buildSslOptions(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) return {};

  const isLocal =
    databaseUrl.includes("localhost") ||
    databaseUrl.includes("127.0.0.1") ||
    databaseUrl.includes(".railway.internal");

  if (isLocal) return {};

  return {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

function getSequelizeOptions(config, databaseUrl) {
  if (config.use_env_variable) {
    return {
      dialect: "postgres",
      logging: config.logging ?? false,
      dialectOptions: buildSslOptions(databaseUrl),
    };
  }

  return config;
}

module.exports = {
  resolveEnv,
  buildSslOptions,
  getSequelizeOptions,
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: (process.env.DB_NAME || "whalewatch_db") + "_test",
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: buildSslOptions(),
  },
};
