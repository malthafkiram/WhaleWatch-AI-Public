const { User, ActiveTrade } = require("../models/index");
const axios = require("axios");

class GameController {
  static async lockPrediction(req, res, next) {
    try {
      const { coinId, prediction } = req.body;
      const UserId = req.user.id;

      const user = await User.findByPk(UserId);
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });

      if (parseFloat(user.virtualCash) < 300) {
        return res
          .status(400)
          .json({ message: "Saldo virtual cash tidak mencukupi!" });
      }

      // Cek apakah ada taruhan yang masih menggantung/belum di-settle
      const existingTrade = await ActiveTrade.findOne({
        where: { UserId, status: "PENDING" },
      });

      if (existingTrade) {
        // Hitung selisih waktu detik ini dengan waktu pembuatan trade menggantung
        const timeElapsed =
          Date.now() - new Date(existingTrade.createdAt).getTime();
        const oneMinute = 60000; // Konversi 1 menit ke dalam satuan milidetik

        if (timeElapsed >= oneMinute) {
          console.log(
            `⏳ [AUTO-RECOVERY] Mendeteksi transaksi menggantung untuk UserId ${UserId}. Mengevaluasi paksa...`,
          );

          // Ambil harga penutupan pasar saat ini secara riil dari CoinGecko
          const BASE_URL = `https://api.coingecko.com/api/v3/coins/${existingTrade.coinId}`;
          const coinResponse = await axios.get(BASE_URL, {
            headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
            params: {
              localization: false,
              tickers: false,
              community_data: false,
              developer_data: false,
            },
          });

          const exitPrice = coinResponse.data.market_data.current_price.usd;
          const entryPrice = parseFloat(existingTrade.entryPrice);

          // Evaluasi perbandingan harga (Logika perhitungan untung/rugi)
          const isPriceUp = exitPrice > entryPrice;
          const userWon =
            (existingTrade.prediction === "PUMP" && isPriceUp) ||
            (existingTrade.prediction === "DUMP" && !isPriceUp);

          let resultStatus = "LOSE";
          if (userWon) {
            resultStatus = "WIN";
            user.virtualCash = parseFloat(user.virtualCash) + 500.0;
            user.xp = user.xp + 15;
          } else {
            user.virtualCash = Math.max(
              0,
              parseFloat(user.virtualCash) - 300.0,
            );
          }

          // Evaluasi ambang batas Level Up (XP Threshold)
          const xpThreshold = user.level * 100;
          if (user.xp >= xpThreshold) {
            user.level += 1;
            user.xp -= xpThreshold;
          }

          await user.save();

          // Ubah status trade yang menggantung lama tadi menjadi WIN/LOSE agar kuncian terbuka
          existingTrade.status = resultStatus;
          await existingTrade.save();

          console.log(
            `🚀 [AUTO-RECOVERY SUCCESS] Kuncian akun UserId ${UserId} resmi dibuka.`,
          );
        } else {
          // Jika transaksi pending ternyata usianya BENAR-BENAR belum lewat 1 menit
          return res.status(400).json({
            message:
              "Anda masih memiliki transaksi yang berjalan! Mohon tunggu blok harga ditutup.",
          });
        }
      }

      // 2. KONDISI BERSIH: BUAT TRANSAKSI BARU SEPERTI BIASA

      const BASE_URL = `https://api.coingecko.com/api/v3/coins/${coinId}`;
      const coinResponse = await axios.get(BASE_URL, {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
        },
      });
      const currentEntryPrice = coinResponse.data.market_data.current_price.usd;

      const newTrade = await ActiveTrade.create({
        UserId,
        coinId,
        prediction,
        entryPrice: currentEntryPrice,
        status: "PENDING",
      });

      res.status(200).json({
        message: "Posisi berhasil dibuka! Menunggu penutupan blok harga...",
        data: { entryPrice: currentEntryPrice, tradeId: newTrade.id },
      });
    } catch (error) {
      next(error);
    }
  }

  // Mengevaluasi kemenangan secara reguler via polling interval frontend
  static async settlePrediction(req, res, next) {
    try {
      const UserId = req.user.id;

      const activeTrade = await ActiveTrade.findOne({
        where: { UserId, status: "PENDING" },
      });
      if (!activeTrade)
        return res.status(400).json({
          message: "Tidak ada transaksi aktif yang perlu diselesaikan.",
        });

      const user = await User.findByPk(UserId);

      const BASE_URL = `https://api.coingecko.com/api/v3/coins/${activeTrade.coinId}`;
      const coinResponse = await axios.get(BASE_URL, {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
        },
      });
      const exitPrice = coinResponse.data.market_data.current_price.usd;
      const entryPrice = parseFloat(activeTrade.entryPrice);

      const isPriceUp = exitPrice > entryPrice;
      const userWon =
        (activeTrade.prediction === "PUMP" && isPriceUp) ||
        (activeTrade.prediction === "DUMP" && !isPriceUp);

      let resultStatus = "LOSE";
      if (userWon) {
        resultStatus = "WIN";
        user.virtualCash = parseFloat(user.virtualCash) + 500.0;
        user.xp = user.xp + 15;
      } else {
        user.virtualCash = Math.max(0, parseFloat(user.virtualCash) - 300.0);
      }

      const xpThreshold = user.level * 100;
      let leveledUp = false;
      if (user.xp >= xpThreshold) {
        user.level += 1;
        user.xp -= xpThreshold;
        leveledUp = true;
      }

      await user.save();

      activeTrade.status = resultStatus;
      await activeTrade.save();

      res.status(200).json({
        message: userWon ? "Prediksi Akurat!" : "Whale Trap! Prediksi Meleset",
        data: {
          result: resultStatus,
          entryPrice,
          exitPrice,
          leveledUp,
          user: {
            virtualCash: user.virtualCash,
            xp: user.xp,
            level: user.level,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // 🏆 Leaderboard Global Trader ("Hall of Whales")
  static async getLeaderboard(req, res, next) {
    try {
      const topUsers = await User.findAll({
        attributes: ["id", "username", "email", "virtualCash", "level", "xp", "isPremium"],
        order: [
          ["virtualCash", "DESC"],
          ["level", "DESC"],
        ],
        limit: 20,
      });

      const leaderboard = topUsers.map((u, idx) => {
        let badge = "Shrimp";
        const rank = idx + 1;
        if (rank === 1) badge = "Apex Titan";
        else if (rank <= 3) badge = "Whale Lord";
        else if (rank <= 10) badge = "Market Shark";
        else if (rank <= 20) badge = "Cyber Dolphin";

        return {
          rank,
          id: u.id,
          username: u.username || u.email.split("@")[0],
          virtualCash: parseFloat(u.virtualCash),
          level: u.level,
          xp: u.xp,
          isPremium: u.isPremium,
          badge,
        };
      });

      res.status(200).json({
        message: "Fetch global leaderboard successfully",
        data: leaderboard,
      });
    } catch (error) {
      next(error);
    }
  }

  // 📜 Log Riwayat Trading Game Pengguna
  static async getHistory(req, res, next) {
    try {
      const UserId = req.user.id;
      const trades = await ActiveTrade.findAll({
        where: { UserId },
        order: [["createdAt", "DESC"]],
        limit: 30,
      });

      res.status(200).json({
        message: "Fetch trade history successfully",
        data: trades,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GameController;

