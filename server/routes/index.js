const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const auth = require("./auth");
const coins = require("./coins");
const aiRouter = require("./aiRoutes");
const watchlistRoutes = require("./watchlistRoutes");
const paymentRoutes = require("./paymentRoutes");
const gameRoutes = require("./gameRoutes");

router.use("/api/auth", auth);
router.use("/api/coins", coins);
router.use("/api/ai", aiRouter);
router.use("/api/watchlist", watchlistRoutes);
router.use("/api/payment", paymentRoutes);
router.use("/api/game", gameRoutes);

module.exports = router;
