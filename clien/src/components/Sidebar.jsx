import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import {
  LayoutDashboard,
  Coins,
  Zap,
  Bitcoin,
  X,
  Trophy,
  Info,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { setLogout } from "../store/authSlice.js";

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const isPremiumUser =
    user && (user.isPremium === true || String(user.isPremium) === "true");

  const handleLogoutClick = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  const menuItems = [
    { path: "/", name: "RADAR PASAR", icon: LayoutDashboard },
    { path: "/watchlist", name: "DAFTAR PANTAUAN", icon: Coins },
    { path: "/leaderboard", name: "PAPAN PERINGKAT", icon: Trophy },
    { path: "/upgrade", name: "UPGRADE KE PRO", icon: Zap },
    { path: "/info", name: "INFORMASI & PANDUAN", icon: Info },
  ];

  return (
    <>
      {/* Backdrop Overlay untuk Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[min(16rem,85vw)] h-[100dvh] bg-cyber-dark border-r border-gray-800/80 fixed left-0 top-0 flex flex-col justify-between p-5 pb-8 md:p-6 md:pb-8 z-40 transition-transform duration-300 md:translate-x-0 safe-pt safe-pb ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8 md:space-y-10">
          {/* LOGO UTAMA PLATFORM DAN CLOSE BUTTON MOBILE */}
          <div className="flex items-center justify-between px-2 py-4 md:py-5 border-b border-gray-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-neon/10 rounded-xl border border-cyber-neon/30 text-cyber-neon shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Bitcoin className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-sm font-black text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                WHALEWATCH AI
              </span>
            </div>
            {/* Tombol X Tutup Sidebar di Mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/40 md:hidden transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* LIST MENU NAVIGASI INTERNAL */}
          <nav className="space-y-2 md:space-y-2.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 md:py-3.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-all border ${
                      isActive
                        ? "bg-cyber-neon/10 text-cyber-neon border-cyber-neon/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                        : "text-gray-400 border-transparent hover:bg-cyber-bg/50 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* BLOK PROFIL DAN LOGOUT PADA SIDEBAR */}
        <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-800/80 font-mono">
          <div className="flex items-center justify-between bg-cyber-bg/60 p-3 md:p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2.5 md:gap-3 overflow-hidden min-w-0">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80"
                }
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover border border-gray-700 bg-cyber-bg flex-shrink-0"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80";
                }}
              />
              <div className="truncate min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.username || "PENGGUNA_ANONIM"}
                </span>
                {isPremiumUser ? (
                  <span className="text-[9px] font-black text-cyber-neon flex items-center gap-0.5 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 fill-cyber-neon" /> PRO
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-500 flex items-center gap-0.5 mt-0.5">
                    <User className="w-2.5 h-2.5" /> GRATIS
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 md:py-3 text-xs font-bold text-cyber-rose bg-cyber-rose/10 hover:bg-cyber-rose hover:text-white border border-cyber-rose/30 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> KELUAR AKUN
          </button>

          {/* FOOTER INFORMASI PENGEMBANG */}
          <div className="text-[10px] text-gray-500 pt-2 md:pt-3 mb-2 text-center tracking-widest leading-relaxed">
            SISTEM INTELLIGENCE v1.0 <br />
            Dikembangkan oleh{" "}
            <span className="text-cyber-cyan font-bold">malthafkiram</span>
          </div>
        </div>
      </aside>
    </>
  );
}
