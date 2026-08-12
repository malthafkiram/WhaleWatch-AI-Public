import { BarChart3, Target } from "lucide-react";
import { motion } from "motion/react";
import { formatCryptoPrice } from "../utils/formatters.js";

export default function LiveVolumeMonitor({
  coins = [],
  selectedCoin,
  onSelectCoin,
  gameStatus,
}) {
  // Mengambil 3 koin teratas sebagai kandidat arena pertempuran trading simulator
  const topAssets = [...coins]
    .sort((a, b) => b.current_price - a.current_price)
    .slice(0, 3);

  return (
    <div className="bg-cyber-dark border border-gray-800 p-5 rounded-2xl flex flex-col justify-between gap-3 w-full h-full min-h-[160px] font-mono text-white">
      <div className="space-y-0.5">
        <span className="text-[10px] text-gray-500 font-bold tracking-widest block flex items-center gap-1.5 uppercase">
          <BarChart3 className="w-3.5 h-3.5 text-cyber-pink" /> PILIH KOIN TARGET PREDIKSI
        </span>
        <h3 className="text-white font-black text-sm tracking-wide">
          TARGET PROTOKOL PREDIKSI
        </h3>
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {topAssets.length === 0 ? (
          <div className="text-[11px] text-gray-600 animate-pulse">
            MEMUAT DATA PASAR UTAMA...
          </div>
        ) : (

          topAssets.map((coin) => {
            const isSelected = selectedCoin?.id === coin.id;
            return (
              <motion.div
                key={coin.id}
                whileHover={gameStatus !== "WAITING" ? { x: 4 } : {}}
                onClick={() => gameStatus !== "WAITING" && onSelectCoin(coin)}
                className={`flex items-center justify-between p-2 rounded-xl border text-[11px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyber-pink/10 border-cyber-pink text-white shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                    : "bg-cyber-bg/50 border-gray-900 text-gray-400 hover:border-gray-800"
                } ${gameStatus === "WAITING" ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <Target
                    className={`w-3.5 h-3.5 ${isSelected ? "text-cyber-pink" : "text-gray-600"}`}
                  />
                  <span>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </span>
                </div>
                <div className="text-right font-bold">
                  <span
                    className={isSelected ? "text-cyber-cyan" : "text-gray-400"}
                  >
                    {formatCryptoPrice(coin.current_price)}
                  </span>

                  <span
                    className={`block text-[9px] ${coin.price_change_percentage_24h >= 0 ? "text-cyber-emerald" : "text-cyber-rose"}`}
                  >
                    {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
