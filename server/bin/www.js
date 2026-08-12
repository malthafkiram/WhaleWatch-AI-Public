require("dotenv").config();

const { resolveEnv } = require("../config/config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = resolveEnv();
}

const app = require("../app");
const { sequelize } = require("../models");
const port = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log(`Database connected (${process.env.NODE_ENV})`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }

  app.listen(port, () => {
    console.log(`WhaleWatch API listening on port ${port}`);
  });
}

start();
