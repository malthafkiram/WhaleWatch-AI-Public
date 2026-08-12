import { motion } from "motion/react";
import {
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
} from "lucide-react";

export default function AnimatedGauge({
  gameStatus,
  onPlaceBet,
  virtualCash,
  score = 50,
  level = 1,
  xp = 0,
}) {
  // ===========================================================================
  // KALKULASI MATEMATIKA: Menghitung Keliling Lingkaran SVG & Progress Bar XP
  // ===========================================================================
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Memastikan batas score berada di antara 0-100 untuk menghindari kerusakan render SVG
  const safeScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Rumus batas XP level-up dinamis yang sinkron dengan rumus backend (Level * 100)
  const xpNeeded = level * 100;
  const xpPercentage = Math.min((xp / xpNeeded) * 100, 100);

  // Fungsi penentu warna reaktif berdasarkan status indikator keaktifan taruhan
  const getThemeColor = () => {
    if (safeScore >= 70) return "#10B981"; // Win Zone (Neon Emerald)
    if (safeScore <= 30) return "#EF4444"; // Lose Zone (Neon Rose)
    return "#06B6D4"; // Neutral/Idle Zone (Neon Cyan)
  };

  return (
    <div className="bg-cyber-dark border border-gray-800 p-5 rounded-2xl flex flex-col justify-between gap-5 w-full h-full min-h-[180px] relative font-mono text-white shadow-2xl overflow-hidden group">
      {/* Ornamen Garis Dekoratif Atas Cyberpunk */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-cyan via-purple-500 to-transparent opacity-40"></div>

      {/* BARIS DATA ATAS: Status Node & Dompet Finansial */}
      <div className="flex justify-between items-center border-b border-gray-800/60 pb-2.5">
        <span className="text-[10px] text-gray-500 font-bold tracking-widest flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />{" "}
          NODE SIMULASI TRADING V4.0
        </span>
        <span className="text-xs font-black text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-2.5 py-0.5 rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.15)] tracking-wide">
          SALDO: ${virtualCash.toLocaleString()}
        </span>
      </div>

      {/* PANEL UTAMA: Pembagian Kolom Tombol Kontrol (Kiri) & Status Level/Gauge (Kanan) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* SEKTOR KIRI: Kontrol Taruhan & Indikator Progress XP */}
        <div className="flex flex-col gap-3 flex-1 w-full">
          {/* Pangkat Level Pengguna */}
          <div className="flex items-center gap-2 bg-gray-900/40 border border-gray-800/80 px-3 py-1.5 rounded-xl w-fit whitespace-nowrap inline-flex">
            <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-wider text-gray-300 whitespace-nowrap">
              RANK TRADER:{" "}
              <span className="text-white font-black text-xs whitespace-nowrap">LVL {level}</span>
            </span>
          </div>


          {/* Progress Bar Pengukur Level-Up */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-gray-500 font-bold tracking-wider">
              <span className="flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 text-cyber-cyan" /> MATRIKS PENGALAMAN (XP)
              </span>
              <span className="text-gray-400">
                {xp} / {xpNeeded} XP
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-900/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 12 }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-blue-500 rounded-full"
                style={{ filter: "drop-shadow(0 0 4px #06B6D4)" }}
              />
            </div>
          </div>

          {/* Tombol Aksi Eksekusi Taruhan */}
          <div className="space-y-1.5 mt-1">
            <span className="text-[9px] text-gray-400 font-bold tracking-wider block">
              PREDIKSI ARAH 1 MENIT KE DEPAN:
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlaceBet("PUMP")}
                disabled={gameStatus === "WAITING"}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  gameStatus === "WAITING"
                    ? "bg-gray-800/40 text-gray-600 border-transparent cursor-not-allowed"
                    : "bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/30 hover:bg-cyber-emerald hover:text-cyber-bg hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                }`}
              >
                <TrendingUp className="w-3 h-3" /> PUMP (NAIK)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlaceBet("DUMP")}
                disabled={gameStatus === "WAITING"}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  gameStatus === "WAITING"
                    ? "bg-gray-800/40 text-gray-600 border-transparent cursor-not-allowed"
                    : "bg-cyber-rose/10 text-cyber-rose border-cyber-rose/30 hover:bg-cyber-rose hover:text-cyber-bg hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                }`}
              >
                <TrendingDown className="w-3 h-3" /> DUMP (TURUN)
              </motion.button>
            </div>
          </div>
        </div>

        {/* SEKTOR KANAN: Speedometer Lingkaran */}
        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0 bg-gray-900/20 rounded-full p-2 border border-gray-800/40">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#1E293B"
              strokeWidth="7"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke={getThemeColor()}
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${getThemeColor()})` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <motion.span
              animate={{ color: getThemeColor() }}
              className="text-xl font-black text-white tracking-tighter"
            >
              {safeScore}%
            </motion.span>
            <span className="text-[6px] text-gray-500 font-bold tracking-widest uppercase">
              MUTASI
            </span>
          </div>
        </div>
      </div>

      {/* TEKS PROSES TERMINAL */}
      <div className="text-[9px] text-gray-500 italic border-t border-gray-900 pt-2 flex items-center justify-between">
        <span>
          {gameStatus === "WAITING"
            ? "> 📡 Telemetri terkunci. Menunggu blok harga ditutup..."
            : "> 🟢 Sistem siaga. Siap mengeksekusi prediksi."}
        </span>
        <span className="text-[8px] uppercase tracking-normal text-cyber-cyan font-bold bg-cyber-cyan/5 px-1.5 py-0.5 rounded border border-cyber-cyan/20 animate-pulse">
          {gameStatus === "WAITING" ? "MENUNGGU" : "SIAGA"}
        </span>
      </div>

    </div>
  );
}
