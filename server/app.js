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

app.get("/health", async (req, res) => {
  let db = "unknown";
  try {
    const { sequelize } = require("./models");
    await sequelize.authenticate();
    db = "connected";
  } catch {
    db = "error";
  }

  res.json({
    status: db === "connected" ? "ok" : "degraded",
    uptime: process.uptime(),
    env: resolveEnv(),
    db,
    ai: isAiConfigured() ? "configured" : "missing_groq_api_key",
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.use(errorHandler);

module.exports = app;
