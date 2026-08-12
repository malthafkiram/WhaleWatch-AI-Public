const express = require("express");
const router = express.Router();
const AiController = require("../controllers/aiController");
const authentication = require("../middlewares/authentication");

router.get("/analyze/:id", authentication, AiController.analyzeCoin);
router.post("/chat", authentication, AiController.chatWithCopilot);
router.get("/whale-alerts", authentication, AiController.getWhaleAlerts);
router.post("/portfolio-audit", authentication, AiController.auditPortfolio);

module.exports = router;

