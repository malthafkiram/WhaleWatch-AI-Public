import { motion } from "motion/react";

export default function SentimentBar({ score, status }) {
  // Alasan logis menentukan warna dinamis: Memberikan representasi visual instan (High-Contrast) sesuai PRD
  const getColor = () => {
    if (status === "BULLISH")
      return "bg-cyber-emerald shadow-[0_0_15px_#10B981]";
    if (status === "BEARISH") return "bg-cyber-rose shadow-[0_0_15px_#EF4444]";
    return "bg-cyber-amber shadow-[0_0_15px_#F59E0B];";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-mono text-gray-400">
        <span>SENTIMENT INDEX</span>
        <span className="font-bold text-white">{score} / 100</span>
      </div>
      <div className="w-full h-3 bg-cyber-bg border border-gray-800 rounded-full overflow-hidden">
        {/* Menggunakan motion.div untuk menganimasikan pengisian batang bar dari koordinat 0% */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full transition-all ${getColor()}`}
        />
      </div>
    </div>
  );
}
