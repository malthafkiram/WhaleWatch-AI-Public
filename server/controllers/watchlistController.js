const { Watchlist } = require("../models/index");

class WatchlistController {
  static async addWatchlist(req, res, next) {
    try {
      const { coinId } = req.body;
      const UserId = req.user.id;

      if (!coinId) throw { name: "notcoin" };

      const existingWatchlist = await Watchlist.findOne({
        where: { UserId, coinId },
      });

      if (existingWatchlist) throw { name: "existingWatchlist" };

      const newWatchlist = await Watchlist.create({
        UserId,
        coinId,
        notes: "",
      });

      res.status(201).json({
        message: "Berhasil menambahkan koin ke watchlist",
        data: newWatchlist,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWatchlist(req, res, next) {
    try {
      const UserId = req.user.id;

      const watchlists = await Watchlist.findAll({
        where: { UserId },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Berhasil memuat daftar watchlist",
        data: watchlists,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateWatchlist(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const UserId = req.user.id;

      const watchlist = await Watchlist.findOne({
        where: { id, UserId },
      });

      if (!watchlist) throw { name: "notFoundWhatclist" };

      watchlist.notes = notes;
      await watchlist.save();

      res.status(200).json({
        message: "Koin berhasil diperbarui dari radar pantauan",
        data: watchlist,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteWatchlist(req, res, next) {
    try {
      const { id } = req.params;
      const UserId = req.user.id;

      const watchlist = await Watchlist.findByPk(id);

      if (!watchlist) throw { name: "notFoundWhatclist" };

      if (watchlist.UserId !== UserId) throw { name: "notYours" };

      await watchlist.destroy();

      res.status(200).json({
        message: `Koin ${watchlist.coinId} berhasil dihapus dari watchlist`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WatchlistController;
