import { useSelector } from "react-redux";
import { User, Sparkles, Menu, Radio } from "lucide-react";

export default function Navbar({ onToggleSidebar, onOpenWhaleRadar }) {
  const user = useSelector((state) => state.auth.user);

  const isPremiumUser =
    user && (user.isPremium === true || String(user.isPremium) === "true");

  return (
    <header className="h-16 sm:h-20 bg-cyber-dark/80 backdrop-blur-md border-b border-gray-800/80 fixed top-0 right-0 left-0 md:left-64 flex items-center justify-between gap-4 px-4 sm:px-5 md:px-8 lg:px-10 z-20 transition-all safe-pt">
      <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs font-bold text-gray-400 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka menu navigasi"
          className="p-2.5 min-h-11 min-w-11 -ml-1 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/40 md:hidden transition-colors cursor-pointer flex items-center justify-center"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <span
          className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping flex-shrink-0"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={onOpenWhaleRadar}
          aria-label="Buka radar transaksi whale"
          className="px-2.5 sm:px-3 py-2 min-h-11 bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-xl transition-all flex items-center gap-1.5 font-bold"
        >
          <Radio className="w-4 h-4 animate-pulse flex-shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline tracking-wide">RADAR TRANSAKSI</span>
          <span className="sm:hidden tracking-wide">RADAR</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-4 font-mono min-w-0 flex-shrink-0 pl-2">
        <div className="text-right min-w-0">
          <span className="text-xs md:text-sm font-black text-white block tracking-wide truncate max-w-[140px] lg:max-w-[220px]">
            {user?.username || "PENGGUNA_ANONIM"}
          </span>

          {isPremiumUser ? (
            <span className="text-[10px] font-black text-cyber-neon bg-cyber-neon/10 border border-cyber-neon/40 px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
              <Sparkles className="w-2.5 h-2.5 fill-cyber-neon" aria-hidden="true" />{" "}
              WHALE PRO
            </span>
          ) : (
            <span className="text-[10px] font-bold text-gray-500 bg-gray-800/40 border border-gray-700/60 px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1">
              <User className="w-2.5 h-2.5" aria-hidden="true" /> GRATIS
            </span>
          )}
        </div>

        <img
          src={
            user?.avatar ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80"
          }
          alt=""
          referrerPolicy="no-referrer"
          width={40}
          height={40}
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover border border-gray-700 bg-cyber-bg flex-shrink-0"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80";
          }}
        />
      </div>
    </header>
  );
}
