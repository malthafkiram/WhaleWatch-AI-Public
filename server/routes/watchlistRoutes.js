const express = require("express");
const router = express.Router();
const WatchlistController = require("../controllers/watchlistController");
const authentication = require("../middlewares/authentication");

router.use(authentication);

router.post("/", WatchlistController.addWatchlist);
router.get("/", WatchlistController.getWatchlist);
router.delete("/:id", WatchlistController.deleteWatchlist);
router.put("/:id", WatchlistController.updateWatchlist);

module.exports = router;
