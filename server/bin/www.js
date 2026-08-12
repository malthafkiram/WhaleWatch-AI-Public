require("dotenv").config();

const { resolveEnv } = require("../config/config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = resolveEnv();
}

const app = require("../app");
const { sequelize } = require("../models");
const port = Number(process.env.PORT) || 3000;

async function start() {
  if (port === 5432) {
    console.warn(
      "[boot] PORT=5432 looks like Postgres port. On Railway, delete shared Postgres PORT from this web service so Railway can inject the HTTP service PORT.",
    );
  }

  try {
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("authenticate timeout (10s)")), 10000),
      ),
    ]);
    console.log(`Database connected (${process.env.NODE_ENV})`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`WhaleWatch API listening on port ${port}`);
  });
}

start();
