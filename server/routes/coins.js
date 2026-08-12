const express = require("express");
const CoinController = require("../controllers/coinController");
const router = express.Router();

router.get("/markets", CoinController.getMarketData);
router.get("/detail/:id", CoinController.getCoinDetail);
router.get("/chart/:id", CoinController.getCoinChart);

module.exports = router;

