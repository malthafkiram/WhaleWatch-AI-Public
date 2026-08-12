require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors");
const { isAiConfigured } = require("./utils/aiService");
const { resolveEnv } = require("./config/config");

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "access-token-google",
      "access_token_google",
    ],
  }),
);

// Jalur menuju dokumentasi API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "WhaleWatch AI API",
    docs: "/api-docs",
    health: "/health",
  });
});

// Liveness only — must stay fast/200 for Railway healthcheck even if DB is down.
// Do not await DB here; a hung authenticate() would fail the deploy healthcheck.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    env: resolveEnv(),
    ai: isAiConfigured() ? "configured" : "missing_groq_api_key",
  });
});

app.get("/ready", async (req, res) => {
  try {
    const { sequelize } = require("./models");
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("db_authenticate_timeout")), 3000),
      ),
    ]);
    res.status(200).json({ status: "ready", db: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "not_ready",
      db: "error",
      message: error.message,
    });
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.use(errorHandler);

module.exports = app;
