import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { LayoutDashboard, AlertCircle } from "lucide-react";
import {
  fetchCoinsStart,
  fetchCoinsSuccess,
  fetchCoinsFailure,
  setGameStatusGlobal,
} from "../store/cryptoSlice.js";
import { addToWatchlist } from "../store/watchlistSlice.js";
import CryptoRow, { CryptoCard } from "../components/CryptoRow.jsx";
import api from "../utils/api.js";
import { formatCryptoPrice } from "../utils/formatters.js";

import AnimatedGauge from "../components/AnimatedGauge.jsx";
import LiveTerminalFeed from "../components/LiveTerminalFeed.jsx";

export default function DashboardHome() {
  const dispatch = useDispatch();

  // Ekstraksi state terpadu dari central store Redux
  const { coins, loading, error, gameStatus } = useSelector(
    (state) => state.crypto,
  );
  const [noti, setNoti] = useState(null);

  // STATE ENGINE GAME LOKAL (Tetap dipertahankan untuk profil finansial)
  const [virtualCash, setVirtualCash] = useState(() => {
    const savedCash = localStorage.getItem("ww_virtual_cash");
    return savedCash ? parseFloat(savedCash) : 5000;
  });

  const [userLevel, setUserLevel] = useState(() => {
    const savedLevel = localStorage.getItem("ww_user_level");
    return savedLevel ? parseInt(savedLevel) : 1;
  });

  const [userXp, setUserXp] = useState(() => {
    const savedXp = localStorage.getItem("ww_user_xp");
    return savedXp ? parseInt(savedXp) : 0;
  });

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [gaugeScore, setGaugeScore] = useState(50);

  // Sinkronisasi data dompet saat komponen dimuat
  useEffect(() => {
    const syncUserWallet = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        const userData = response.data?.user;
        if (userData) {
          const freshCash = parseFloat(userData.virtualCash || 5000);
          const freshLevel = parseInt(userData.level || 1);
          const freshXp = parseInt(userData.xp || 0);
          const freshIsPremium = userData.isPremium;

          setVirtualCash(freshCash);
          setUserLevel(freshLevel);
          setUserXp(freshXp);

          localStorage.setItem("ww_virtual_cash", freshCash);
          localStorage.setItem("ww_user_level", freshLevel);
          localStorage.setItem("ww_user_xp", freshXp);
          localStorage.setItem("ww_is_premium", freshIsPremium);
        }
      } catch (err) {
        console.error("Gagal memuat profil finansial virtual game:", err);
      }
    };
    syncUserWallet();
  }, []);

  // Polling pasar berkala + Otomatis Memicu Settlement Game di Backend
  useEffect(() => {
    const getMarketData = async (isSilent = false) => {
      try {
        if (!isSilent) {
          dispatch(fetchCoinsStart());
        }
        const response = await api.get("/api/coins/markets");
        const freshCoins = response.data.data;
        dispatch(fetchCoinsSuccess(freshCoins));

        // Jika status WAITING aktif di Redux Store global, jalankan settlement evaluasi
        if (isSilent && gameStatus === "WAITING") {
          try {
            const gameResponse = await api.post("/api/game/settle");
            const {
              result,
              user: updatedUser,
              leveledUp,
            } = gameResponse.data.data;

            const nextCash = parseFloat(updatedUser.virtualCash);
            const nextLevel = parseInt(updatedUser.level);
            const nextXp = parseInt(updatedUser.xp);

            setVirtualCash(nextCash);
            setUserLevel(nextLevel);
            setUserXp(nextXp);

            localStorage.setItem("ww_virtual_cash", nextCash);
            localStorage.setItem("ww_user_level", nextLevel);
            localStorage.setItem("ww_user_xp", nextXp);

            if (result === "WIN") {
              setGaugeScore(85);
              setNoti({
                type: "success",
                msg: `BLOCK SETTLED! Prediksi Anda akurat. Profit +$500 berhasil diamankan! ${leveledUp ? "LEVEL UP ACCELERATED!" : ""}`,
              });
            } else {
              setGaugeScore(20);
              setNoti({
                type: "error",
                msg: `🚨 BLOCK SETTLED! Prediksi Anda meleset akibat manipulasi pasar. Saldo dipotong -$300.`,
              });
            }
          } catch (gameErr) {
            console.error(
              "Proses settlement dilewati:",
              gameErr.response?.data?.message,
            );
          } finally {
            // Mengembalikan kuncian game ke IDLE di level global Redux Store
            dispatch(setGameStatusGlobal("IDLE"));
          }
        }
      } catch (err) {
        if (!isSilent) {
          dispatch(
            fetchCoinsFailure(
              err.response?.data?.message || "Gagal memuat sirkulasi pasar.",
            ),
          );
        }
      }
    };

    getMarketData(false);

    const marketInterval = setInterval(() => {
      getMarketData(true);
    }, 60000);

    return () => {
      clearInterval(marketInterval);
    };
  }, [dispatch, gameStatus]);

  // HANDLER A KLIEN: Mengunci Prediksi Awal & Entry Price ke Database
  const handlePlaceBet = async (type) => {
    if (!selectedCoin) {
      alert("Silakan tentukan koin target operasi Anda terlebih dahulu!");
      return;
    }

    try {
      // Set status WAITING ke Redux Store global agar terkunci permanen
      dispatch(setGameStatusGlobal("WAITING"));
      setGaugeScore(50);
      setNoti(null);

      await api.post("/api/game/predict", {
        coinId: selectedCoin.id,
        prediction: type,
      });

      setNoti({
        type: "success",
        msg: `📥 POSISI DIBUKA! Mengunci prediksi ${type} pada ${selectedCoin.name}. Menunggu penutupan blok harga 1 menit ke depan...`,
      });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      alert(`[BACKEND CRITICAL ERROR]: ${serverMsg}`);

      // REVISI ARSITEKTUR: Kembalikan status ke IDLE di Redux jika gagal menembak API gerbang awal
      dispatch(setGameStatusGlobal("IDLE"));
    }
  };

  useEffect(() => {
    if (coins.length > 0 && !selectedCoin) {
      setSelectedCoin(coins[0]);
    }
  }, [coins, selectedCoin]);

  const handleCreateWatchlist = async (coinId) => {
    try {
      setNoti(null);
      const response = await api.post("/api/watchlist", { coinId });
      dispatch(addToWatchlist(response.data.data));
      setNoti({
        type: "success",
        msg: `Koin ${coinId.toUpperCase()} masuk ke radar pantauan!`,
      });
    } catch (err) {
      setNoti({
        type: "error",
        msg: err.response?.data?.message || "Koin gagal didaftarkan.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6 font-mono"
    >
      {/* TICKER MARQUEE RUNNING TEXT */}
      <div className="w-full bg-cyber-dark border border-cyber-cyan/20 rounded-xl py-3 overflow-hidden relative flex items-center">
        <div className="absolute left-0 top-0 bottom-0 bg-cyber-dark px-3 sm:px-4 font-bold text-cyber-cyan border-r border-gray-800 z-10 text-[10px] sm:text-xs flex items-center">
          LIVE
        </div>
        <div className="animate-marquee whitespace-nowrap flex gap-10 sm:gap-12 text-xs sm:text-sm tracking-wider pl-14 sm:pl-20">
          {coins.slice(0, 5).map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2">
              <span className="text-white font-bold"> {c.symbol} </span>
              <span className="text-gray-400 tabular-nums">
                {formatCryptoPrice(c.current_price)}
              </span>

              <span
                className={
                  c.price_change_percentage_24h >= 0
                    ? "text-cyber-emerald"
                    : "text-cyber-rose"
                }
              >
                {c.price_change_percentage_24h >= 0 ? "+" : ""}
                {c.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* AREA WIDGET INTERAKTIF DENGAN KENDALI PROPS PERSISTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <AnimatedGauge
          score={gaugeScore}
          gameStatus={gameStatus}
          onPlaceBet={handlePlaceBet}
          virtualCash={virtualCash}
          level={userLevel}
          xp={userXp}
        />
        <LiveTerminalFeed
          coins={coins}
          selectedCoin={selectedCoin}
          onSelectCoin={setSelectedCoin}
          gameStatus={gameStatus}
        />
      </div>

      {/* HEADER UTAMA DASBOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-dark/40 border border-gray-800 p-4 sm:p-6 rounded-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 sm:p-3 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/30 text-cyber-cyan flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide">
              RADAR PASAR & INTELIJEN KRIPTO
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Memantau pergerakan koin raksasa bursa kripto global
            </p>
          </div>
        </div>
      </div>

      {/* NOTIFIKASI HASIL TRADING VIRTUAL/GAME */}
      {noti && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 border rounded-xl flex items-center gap-2 text-sm ${
            noti.type === "success"
              ? "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald"
              : "bg-cyber-rose/10 border-cyber-rose text-cyber-rose"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{noti.msg}</span>
        </motion.div>
      )}

      {/* PASAR: kartu mobile + tabel desktop */}
      <div className="bg-cyber-dark border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-10 sm:p-12 text-center text-gray-500 tracking-widest animate-pulse text-xs sm:text-sm">
            MEMUAT DATA PASAR BLOCKCHAIN REAL-TIME...
          </div>
        ) : error ? (
          <div className="p-10 sm:p-12 text-center text-cyber-rose text-sm">
            {error}
          </div>
        ) : (
          <>
            <div className="md:hidden p-3 space-y-2.5">
              {coins.map((coin, index) => (
                <CryptoCard
                  key={coin.id}
                  coin={coin}
                  index={index}
                  onAddToWatchlist={handleCreateWatchlist}
                  onSelect={setSelectedCoin}
                />
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cyber-dark/80 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-4 font-normal">#</th>
                    <th className="py-4 px-4 font-normal">Nama Aset</th>
                    <th className="py-4 px-4 font-normal">Harga Live (USD)</th>
                    <th className="py-4 px-4 font-normal">Perubahan 24J</th>
                    <th className="py-4 px-4 font-normal">Kategori Klaster</th>
                    <th className="py-4 px-4 font-normal text-center">Pantau</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin, index) => (
                    <CryptoRow
                      key={coin.id}
                      coin={coin}
                      index={index}
                      onAddToWatchlist={handleCreateWatchlist}
                      onRowClick={() => setSelectedCoin(coin)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
