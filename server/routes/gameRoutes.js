const express = require("express");
const router = express.Router();
const GameController = require("../controllers/gameController");
const authentication = require("../middlewares/authentication");

router.post("/predict", authentication, GameController.lockPrediction);
router.post(
  "/settle",
  authentication,
  GameController.submitPrediction
    ? GameController.settlePrediction
    : GameController.settlePrediction,
);
router.get("/leaderboard", authentication, GameController.getLeaderboard);
router.get("/history", authentication, GameController.getHistory);

module.exports = router;

