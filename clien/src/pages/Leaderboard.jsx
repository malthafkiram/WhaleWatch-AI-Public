import { useEffect, useState } from "react";
import {
  Trophy,
  Crown,
  Medal,
  History,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../utils/api";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leaderboard");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lbRes, histRes] = await Promise.all([
        api.get("/api/game/leaderboard"),
        api.get("/api/game/history").catch(() => ({ data: { data: [] } })),
      ]);
      setLeaders(lbRes.data?.data || []);
      setHistory(histRes.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1)
      return <Crown className="w-5 h-5 text-amber-400 animate-bounce" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-bold text-xs">#{rank}</span>;
  };

  const getBadgeColor = (badge) => {
    if (badge === "Apex Titan")
      return "bg-amber-400/10 border-amber-400 text-amber-400";
    if (badge === "Whale Lord")
      return "bg-cyber-neon/10 border-cyber-neon text-cyber-neon";
    if (badge === "Market Shark")
      return "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan";
    if (badge === "Cyber Dolphin")
      return "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald";
    return "bg-gray-800 border-gray-700 text-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6 font-mono"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-dark/60 border border-gray-800 p-4 sm:p-6 rounded-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 sm:p-3 bg-amber-400/10 rounded-xl border border-amber-400/30 text-amber-400 flex-shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide">
              PAPAN PERINGKAT
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Trader virtual terbaik & log performa trading
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto p-1 bg-cyber-dark border border-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`min-h-11 px-2.5 sm:px-4 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === "leaderboard"
                ? "bg-cyber-cyan text-cyber-dark shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" /> TRADER TERATAS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`min-h-11 px-2.5 sm:px-4 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === "history"
                ? "bg-cyber-cyan text-cyber-dark shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <History className="w-4 h-4 flex-shrink-0" /> RIWAYAT TRADING
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-10 sm:p-12 text-center text-cyber-cyan animate-pulse tracking-widest bg-cyber-dark border border-gray-800 rounded-2xl text-xs sm:text-sm">
          MEMUAT PERINGKAT GLOBAL…
        </div>
      ) : activeTab === "leaderboard" ? (
        <div className="bg-cyber-dark border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="md:hidden p-3 space-y-2.5">
            {leaders.map((u) => (
              <article
                key={u.id}
                className="bg-cyber-bg/60 border border-gray-800/80 rounded-2xl p-3.5 flex items-center gap-3"
              >
                <div className="w-10 flex justify-center flex-shrink-0">
                  {getRankBadge(u.rank)}
                </div>
                <div className="w-9 h-9 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan font-bold text-xs flex-shrink-0">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm truncate">
                      {u.username}
                    </span>
                    {u.isPremium && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-neon/20 border border-cyber-neon text-cyber-neon font-bold flex-shrink-0">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${getBadgeColor(
                        u.badge,
                      )}`}
                    >
                      {u.badge}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-cyber-bg border border-gray-800 rounded-md text-cyber-cyan font-bold">
                      LVL {u.level}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="block text-[10px] text-gray-500 uppercase">
                    Cash
                  </span>
                  <span className="font-black text-white text-sm tabular-nums">
                    ${u.virtualCash?.toLocaleString()}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cyber-dark/80 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider whitespace-nowrap">
                  <th className="py-4 px-4 font-normal text-center">
                    Peringkat
                  </th>
                  <th className="py-4 px-4 font-normal">Trader</th>
                  <th className="py-4 px-4 font-normal">Gelar Badge</th>
                  <th className="py-4 px-4 font-normal text-center">Level</th>
                  <th className="py-4 px-4 font-normal text-right">
                    Saldo Virtual (USD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {leaders.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-cyber-cyan/5 transition-colors font-mono"
                  >
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex justify-center items-center">
                        {getRankBadge(u.rank)}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan font-bold text-xs flex-shrink-0">
                          {u.username[0].toUpperCase()}
                        </div>
                        <span>{u.username}</span>
                        {u.isPremium && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-neon/20 border border-cyber-neon text-cyber-neon font-bold flex-shrink-0">
                            PRO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-lg border font-bold inline-flex items-center gap-1.5 ${getBadgeColor(
                          u.badge,
                        )}`}
                      >
                        {u.badge}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-cyber-bg border border-gray-800 rounded-lg text-cyber-cyan font-bold text-xs">
                        LVL {u.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-black text-white text-base tabular-nums">
                      ${u.virtualCash?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-cyber-dark border border-gray-800 rounded-2xl overflow-hidden p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-cyber-cyan" /> RECENT PREDICTION
            POSITIONS
          </h3>
          {history.length === 0 ? (
            <div className="p-10 sm:p-12 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-xl">
              Belum ada riwayat trading game yang tercatat. Buka posisi
              pertamamu di Dasbor!
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => {
                const isWin = h.status === "WIN";
                const isPending = h.status === "PENDING";

                return (
                  <div
                    key={h.id}
                    className="bg-cyber-bg border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`p-2 rounded-xl font-bold border flex-shrink-0 ${
                          h.prediction === "PUMP"
                            ? "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald"
                            : "bg-cyber-rose/10 border-cyber-rose text-cyber-rose"
                        }`}
                      >
                        {h.prediction === "PUMP" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white uppercase text-sm truncate">
                          {h.coinId} ({h.prediction})
                        </h4>
                        <span className="text-gray-400 text-[11px] tabular-nums">
                          Entry: ${parseFloat(h.entryPrice)?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg border font-bold text-xs ${
                          isWin
                            ? "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald"
                            : isPending
                              ? "bg-cyber-amber/10 border-cyber-amber text-cyber-amber animate-pulse"
                              : "bg-cyber-rose/10 border-cyber-rose text-cyber-rose"
                        }`}
                      >
                        {isWin
                          ? "PROFIT +$500"
                          : isPending
                            ? "WAITING SETTLEMENT"
                            : "LOSS -$300"}
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        {new Date(h.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
