import { useEffect, useState } from "react";
import { X, ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, Radio } from "lucide-react";
import { motion } from "motion/react";
import api from "../utils/api";

export default function WhaleRadarModal({ isOpen, onClose }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/ai/whale-alerts");
      setAlerts(res.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat whale alerts:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 font-mono safe-pt safe-pb safe-px">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-cyber-dark border border-cyber-cyan/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.3)] flex flex-col max-h-[min(88vh,100dvh-2rem)] overscroll-contain"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-cyber-dark/90 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-xl text-cyber-cyan">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                RADAR TRANSAKSI PAUS
                <span className="text-[10px] sm:text-xs font-normal px-2.5 py-0.5 rounded-full bg-cyber-emerald/10 border border-cyber-emerald text-cyber-emerald hidden sm:inline-block">
                  LIVE TELEMETRI
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Memantau transaksi dompet paus kripto bernilai besar & sinyal AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-cyber-cyan/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          {loading ? (
            <div className="p-12 text-center text-cyber-cyan animate-pulse tracking-widest flex items-center justify-center gap-2 text-xs sm:text-sm">
              <RefreshCw className="w-5 h-5 animate-spin" /> MEMINDAI TELEMETRI BLOCKCHAIN DESENTRALISASI...
            </div>
          ) : (
            alerts.map((item) => {
              const isBullish = item.riskLevel === "BULLISH_ACCUMULATION";
              const isBearish = item.riskLevel === "HIGH_DUMP_RISK";

              return (
                <div
                  key={item.id}
                  className="bg-cyber-bg border border-gray-800 rounded-xl p-3.5 sm:p-4 hover:border-cyber-cyan/40 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 text-xs font-bold bg-cyber-dark border border-gray-800 rounded-lg text-white">
                        {item.coin}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                        {item.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span
                        className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 ${
                          isBullish
                            ? "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald"
                            : isBearish
                              ? "bg-cyber-rose/10 border-cyber-rose text-cyber-rose"
                              : "bg-cyber-amber/10 border-cyber-amber text-cyber-amber"
                        }`}
                      >
                        {isBullish ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {item.riskLevel.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-gray-500">{item.timeAgo}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400 font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">ASAL (DOMPET):</span>
                      <span className="text-gray-300 font-bold break-all">{item.from}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">TUJUAN (TARGET):</span>
                      <span className="text-gray-300 font-bold break-all">{item.to}</span>
                    </div>
                  </div>

                  <div className="bg-cyber-dark p-3 rounded-xl border border-gray-800/80 text-xs text-cyber-cyan flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 text-cyber-neon mt-0.5" />
                    <span>
                      <strong className="text-cyber-neon font-bold">EVALUASI AI: </strong>
                      {item.aiSignal}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-cyber-dark border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
          <span>Total Deteksi: {alerts.length} Transaksi</span>
          <button
            onClick={fetchAlerts}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20 rounded-xl transition-all flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> MUAT ULANG RADAR
          </button>
        </div>
      </motion.div>
    </div>
  );
}



