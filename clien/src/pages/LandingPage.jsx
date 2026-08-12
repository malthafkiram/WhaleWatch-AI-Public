import { useNavigate } from "react-router";
import { Bot, Shield, Zap, Trophy, ArrowRight, CheckCircle2, Star, Radio, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot className="w-6 h-6 text-cyber-cyan" />,
      title: "AI Neural Market Radar",
      desc: "Analisis sentimen mendalam berbasis Llama 3.1 & berita terkini langsung dari RSS bursa global.",
    },
    {
      icon: <Radio className="w-6 h-6 text-cyber-neon animate-pulse" />,
      title: "Whale Alert Telemetry",
      desc: "Deteksi pergerakan dompet paus bernilai jutaan dolar secara real-time beserta evaluasi risiko AI.",
    },
    {
      icon: <Zap className="w-6 h-6 text-cyber-emerald" />,
      title: "Gamified Paper Trading",
      desc: "Uji insting trading kamu dengan saldo simulasi virtual cash tanpa risiko finansial sungguhan.",
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: "Global Hall of Whales",
      desc: "Panjat papan peringkat global trader teratas dan dapatkan gelar kehormatan Apex Titan.",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-bg text-white font-mono overflow-x-hidden selection:bg-cyber-cyan selection:text-cyber-dark">
      {/* Background Cyber Grid Glow */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation Top Bar */}
      <nav className="border-b border-gray-800/80 bg-cyber-dark/80 backdrop-blur-xl fixed top-0 w-full z-50 safe-pt safe-px">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 text-cyber-cyan font-black text-base sm:text-xl tracking-wider cursor-pointer min-w-0"
            onClick={() => navigate("/")}
          >
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-cyber-cyan animate-pulse flex-shrink-0" />
            <span className="truncate">
              WHALE<span className="text-white">WATCH</span>
              <span className="text-cyber-neon">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="min-h-11 px-3 sm:px-5 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              LOG IN
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="min-h-11 px-3 sm:px-5 py-2 text-[11px] sm:text-xs font-black bg-gradient-to-r from-cyber-cyan to-cyber-neon text-cyber-dark rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
            >
              <span className="sm:hidden">DAFTAR</span>
              <span className="hidden sm:inline">GET STARTED FREE</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-cyber-cyan text-[11px] sm:text-xs font-bold max-w-full"
        >
          <Sparkles className="w-4 h-4 text-cyber-neon flex-shrink-0" />
          <span className="text-left sm:text-center leading-snug">
            NEXT-GEN AI CRYPTO INTELLIGENCE PLATFORM
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-5xl mx-auto text-balance"
        >
          Navigasi Pasar Kripto Berbasis{" "}
          <span className="bg-gradient-to-r from-cyber-cyan via-cyan-200 to-cyber-neon bg-clip-text text-transparent">
            Intelijen AI & Pergerakan Paus
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
        >
          Deteksi arah angin bursa crypto dengan analisis neural instan, pantau dompet raksasa institusi, dan simulasi strategi trading tanpa beban risiko.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-8 py-4 bg-cyber-cyan text-cyber-dark font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:bg-cyan-300 transition-all flex items-center justify-center gap-2"
          >
            Buka Akun Gratis Sekarang <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-4 bg-cyber-dark border border-gray-800 text-gray-300 hover:text-white hover:border-cyber-cyan/50 font-bold text-sm rounded-2xl transition-all"
          >
            Demo Dasbor Pasar
          </button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
            FITUR KELAS BURSA UNTUK PEMAIN SERIUS
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Platform serba ada yang dirancang khusus untuk meminimalkan *FOMO* dan *Whale Trap*
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-cyber-dark/60 border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-cyber-cyan/40 transition-all"
            >
              <div className="p-3 bg-cyber-bg border border-gray-800 rounded-xl w-fit">
                {f.icon}
              </div>
              <h3 className="font-black text-lg text-white">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Tier Comparison */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-gray-800/80">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
            PILIH PAKET INTELIJEN KAMU
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Tingkatkan ke Whale Pro untuk analisis tak terbatas & fitur eksklusif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-cyber-dark/40 border border-gray-800 p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400">FREE PLAN</span>
              <h3 className="text-3xl font-black text-white">$0 <span className="text-xs font-normal text-gray-500">/ selamanya</span></h3>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-cyan" /> Pantau 30+ Koin Terpopuler</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-cyan" /> Analisis AI Khusus BTC & ETH</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-cyan" /> Saldo Simulasi Virtual $5,000</li>
              </ul>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 bg-cyber-dark border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 text-xs tracking-wider"
            >
              DAFTAR AKUN FREE
            </button>
          </div>

          {/* Whale Pro Tier */}
          <div className="bg-gradient-to-b from-cyber-dark to-cyber-cyan/10 border-2 border-cyber-cyan p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            <span className="absolute -top-3 right-6 bg-cyber-cyan text-cyber-dark text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              MOST POPULAR
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyber-cyan">WHALE PRO TIER</span>
              <h3 className="text-3xl font-black text-white">Rp 50.000 <span className="text-xs font-normal text-gray-400">/ sekali bayar</span></h3>
              <ul className="space-y-3 text-xs text-gray-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-neon" /> Akses Analisis AI Semua Koin Tanpa Batas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-neon" /> Analisis Psikologis & Strategi Rahasia</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-neon" /> Live Whale Radar Telemetry Full Access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyber-neon" /> Badge Spesial PRO di Global Leaderboard</li>
              </ul>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3.5 bg-gradient-to-r from-cyber-cyan to-cyber-neon text-cyber-dark font-black rounded-xl text-xs tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
            >
              UPGRADE TO WHALE PRO
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-8 px-6 text-center text-xs text-gray-500">
        <p>© 2026 WhaleWatch AI Platform. Powered by Llama 3.1 Neural Engine & CoinGecko Telemetry.</p>
      </footer>
    </div>
  );
}
