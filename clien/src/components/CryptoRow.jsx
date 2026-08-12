import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Plus, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { formatCryptoPrice } from "../utils/formatters.js";

/** Mobile card row for market list */
export function CryptoCard({ coin, index, onAddToWatchlist, onSelect }) {
  const navigate = useNavigate();
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="bg-cyber-bg/60 border border-gray-800/80 rounded-2xl p-3.5 active:border-cyber-cyan/40 transition-colors"
    >
      <button
        type="button"
        onClick={() => {
          onSelect?.(coin);
          navigate(`/coin/${coin.id}`);
        }}
        className="w-full flex items-center gap-3 text-left min-h-11"
        aria-label={`Buka detail ${coin.name}`}
      >
        <img
          src={coin.image}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="w-10 h-10 rounded-full flex-shrink-0 border border-gray-800"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm truncate">
              {coin.name}
            </span>
            <span className="text-[11px] text-gray-500 font-mono uppercase flex-shrink-0">
              {coin.symbol}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono font-bold text-white text-sm tabular-nums">
              {formatCryptoPrice(coin.current_price)}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums ${
                isPositive ? "text-cyber-emerald" : "text-cyber-rose"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 text-gray-600 flex-shrink-0"
          aria-hidden="true"
        />
      </button>

      <div className="mt-2.5 pt-2.5 border-t border-gray-800/60 flex items-center justify-between gap-2">
        <span className="text-[11px] px-2 py-1 rounded-md bg-cyber-dark text-cyber-cyan border border-cyber-cyan/30 font-bold truncate max-w-[60%]">
          {coin.category || "Layer 1"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToWatchlist(coin.id);
          }}
          aria-label={`Tambah ${coin.name} ke watchlist`}
          className="min-h-11 min-w-11 px-3 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg border border-cyber-cyan/30 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Pantau
        </button>
      </div>
    </motion.article>
  );
}

export default function CryptoRow({
  coin,
  index,
  onAddToWatchlist,
  onRowClick,
}) {
  const navigate = useNavigate();
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      onClick={onRowClick}
      className="border-b border-gray-800/60 hover:bg-cyber-dark/60 transition-colors cursor-pointer group"
    >
      <td
        className="py-4 px-4 font-mono text-gray-500 text-sm"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        {index + 1}
      </td>

      <td
        className="py-4 px-4"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={coin.image}
            alt=""
            width={24}
            height={24}
            loading="lazy"
            className="w-6 h-6 rounded-full group-hover:scale-110 transition-transform flex-shrink-0"
          />
          <div className="min-w-0">
            <span className="font-bold text-white block group-hover:text-cyber-cyan transition-colors truncate">
              {coin.name}
            </span>
            <span className="text-xs text-gray-400 font-mono tracking-wider uppercase">
              {coin.symbol}
            </span>
          </div>
        </div>
      </td>

      <td
        className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap tabular-nums"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        {formatCryptoPrice(coin.current_price)}
      </td>

      <td
        className="py-4 px-4 font-mono font-bold"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        <span
          className={`inline-flex items-center gap-1 text-sm tabular-nums ${
            isPositive ? "text-cyber-emerald" : "text-cyber-rose"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-4 h-4" aria-hidden="true" />
          )}
          {coin.price_change_percentage_24h?.toFixed(2)}%
        </span>
      </td>

      <td className="py-4 px-4 font-mono">
        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-cyber-dark text-cyber-cyan border border-cyber-cyan/30">
          {coin.category || "Layer 1"}
        </span>
      </td>

      <td className="py-4 px-4 text-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToWatchlist(coin.id);
          }}
          aria-label={`Tambah ${coin.name} ke watchlist`}
          className="p-2.5 min-h-11 min-w-11 inline-flex items-center justify-center bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg border border-cyber-cyan/30 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      </td>
    </motion.tr>
  );
}
