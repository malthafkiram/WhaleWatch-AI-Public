import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { Coins, AlertCircle, ShieldAlert, Sparkles, X, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  setWatchlist,
  updateWatchlistNotes,
  removeFromWatchlist,
} from "../store/watchlistSlice.js";
import WatchlistCard from "../components/WatchlistCard.jsx";
import api from "../utils/api.js";

export default function Watchlist() {
  const dispatch = useDispatch();
  const watchlistItems = useSelector((state) => state.watchlist.items);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/watchlist");
        dispatch(setWatchlist(response.data.data));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Gagal menyinkronkan data radar watchlist.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
  }, [dispatch]);

  const handleUpdateNotes = async (id, notes) => {
    try {
      await api.put(`/api/watchlist/${id}`, { notes });
      dispatch(updateWatchlistNotes({ id, notes }));
    } catch (err) {
      alert(
        err.response?.data?.message || "Gagal memperbarui catatan instruksi.",
      );
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/api/watchlist/${id}`);
      dispatch(removeFromWatchlist(id));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal membersihkan koin dari radar pantauan.",
      );
    }
  };

  const handleRunAudit = async () => {
    if (watchlistItems.length === 0) return;
    try {
      setAuditLoading(true);
      setShowAuditModal(true);
      const coinsToAudit = watchlistItems.map((item) => item.coinId);
      const res = await api.post("/api/ai/portfolio-audit", { coins: coinsToAudit });
      setAuditResult(res.data?.data || null);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menjalankan audit AI.");
      setShowAuditModal(false);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6 font-mono"
    >
      {/* HEADER RADAR PANTAUAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-dark/40 border border-gray-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyber-pink/10 rounded-xl border border-cyber-pink/30 text-cyber-pink">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              DAFTAR PANTAUAN SAYA
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Ruang kendali penuh catatan strategi dan target koin taktis
            </p>
          </div>
        </div>

        {/* AI Portfolio Audit Button */}
        {watchlistItems.length > 0 && (
          <button
            onClick={handleRunAudit}
            className="px-5 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-neon text-cyber-dark font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center gap-2 tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-cyber-dark" />
            <span>AUDIT PORTOFOLIO AI</span>
          </button>
        )}
      </div>

      {/* KONDISI LOADING & ERROR */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 tracking-widest animate-pulse">
          MEMUAT DATA DAFTAR PANTAUAN...
        </div>
      ) : error ? (

        <div className="p-12 text-center text-cyber-rose">
          [CRITICAL ERROR]: {error}
        </div>
      ) : watchlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-cyber-dark/20 text-gray-500 space-y-2"
        >
          <AlertCircle className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="font-bold">RADAR DETEKSI KOSONG</p>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Kamu belum mendaftarkan koin apapun. Kembali ke Dasbor utama dan
            klik ikon "+" pada baris koin untuk mengaktifkan pelacakan.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {watchlistItems.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onUpdateNotes={handleUpdateNotes}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* AI PORTFOLIO AUDIT MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-cyber-dark border border-cyber-cyan/40 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-cyber-cyan font-black text-base">
                <ShieldAlert className="w-5 h-5 text-cyber-neon" />
                <span>AI PORTFOLIO RISK AUDIT</span>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {auditLoading ? (
              <div className="p-12 text-center text-cyber-cyan animate-pulse tracking-widest flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" /> NEURAL ENGINE ANALYZING WATCHLIST EXPOSURE...
              </div>
            ) : auditResult ? (
              <div className="space-y-4 text-xs">
                {/* Risk Gauge Bar */}
                <div className="bg-cyber-bg p-4 rounded-xl border border-gray-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-400">RISK EXPOSURE SCORE:</span>
                    <span
                      className={
                        auditResult.riskScore > 65
                          ? "text-cyber-rose font-black text-lg"
                          : auditResult.riskScore > 35
                            ? "text-cyber-amber font-black text-lg"
                            : "text-cyber-emerald font-black text-lg"
                      }
                    >
                      {auditResult.riskScore} / 100 ({auditResult.riskCategory})
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        auditResult.riskScore > 65
                          ? "bg-cyber-rose"
                          : auditResult.riskScore > 35
                            ? "bg-cyber-amber"
                            : "bg-cyber-emerald"
                      }`}
                      style={{ width: `${auditResult.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-cyber-bg p-4 rounded-xl border border-gray-800 space-y-1">
                  <span className="text-cyber-cyan font-bold block">EXECUTIVE SUMMARY:</span>
                  <p className="text-gray-300 leading-relaxed">{auditResult.summary}</p>
                </div>

                {/* Recommendations */}
                <div className="bg-cyber-bg p-4 rounded-xl border border-gray-800 space-y-2">
                  <span className="text-cyber-neon font-bold block">REBALANCING ADVICE:</span>
                  <ul className="space-y-2 text-gray-300">
                    {auditResult.recommendations?.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

