import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { updatePremiumStatus } from "../store/authSlice.js"; // Mengimpor pengubah state premium
import api from "../utils/api.js";

export default function UpgradePremium() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Membaca data user saat ini
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      // 1. Minta Token Snap dari backend kamu[cite: 6, 23, 28]
      const response = await api.post("/api/payment/initiate");
      const snapToken = response.data.token;

      if (!window.snap) {
        alert(
          "Skrip Midtrans Snap belum termuat di sistem. Periksa berkas index.html kamu!",
        );
        return;
      }

      // 2. Eksekusi Pop-up resmi Midtrans menggunakan skrip window.snap[cite: 6, 28]
      window.snap.pay(snapToken, {
        onSuccess: function () {
          // Sinkronisasi instan ke Redux Store agar seluruh proteksi tirai AI langsung terbuka
          dispatch(updatePremiumStatus(true));
          navigate("/"); // Kembalikan ke dasbor utama setelah sukses
        },
        onPending: function () {
          alert(
            "Sinyal pembayaran tertunda, silakan selesaikan transaksi kamu.",
          );
        },
        onError: function () {
          alert("Gerbang enkripsi pembayaran mengalami kegagalan sistem.");
        },
        onClose: function () {
          alert("Kamu menutup ruang transaksi sebelum otorisasi selesai.");
        },
      });
    } catch (err) {
      alert(
        err.response?.data?.message || "Gagal memicu sesi transaksi Midtrans.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 sm:space-y-12 font-mono text-white"
    >
      {/* HEADER PAGE */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-pink drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          PUSAT UPGRADE MEMBERSHIP PRO
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto px-2">
          Tingkatkan akun Anda menjadi level Whale Pro untuk
          membuka analisis psikologis pasar & fitur AI tanpa batas.
        </p>
      </div>


      {/* PRICING TABLE UI GRID SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {/* KARTU 1: FREE PACKAGE */}
        <div className="bg-cyber-dark/60 border border-gray-800 p-5 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 opacity-70">
          <div className="space-y-4">
            <span className="text-xs font-bold text-gray-500 tracking-widest block uppercase">
              STANDARD CORRIDOR
            </span>
            <h3 className="text-2xl font-black">FREE MEMBER</h3>
            <div className="text-3xl font-black text-white">
              IDR 0{" "}
              <span className="text-xs text-gray-500 font-normal">
                / FOREVER
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Akses standar untuk memantau pergerakan harga 10 koin teratas
              tanpa bimbingan AI.
            </p>

            <ul className="space-y-3 pt-4 border-t border-gray-800/60 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0" />{" "}
                Live Ticker Streaming Harian
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0" />{" "}
                CRUD Personal Watchlist Terbatas
              </li>
              <li className="flex items-center gap-2 text-cyber-rose/60">
                <CheckCircle2 className="w-4 h-4 text-cyber-rose flex-shrink-0" />{" "}
                Tanpa Analisis AI Koin Alternatif
              </li>
            </ul>
          </div>
          <div className="w-full py-3 bg-gray-800/40 text-center text-xs font-bold rounded-xl text-gray-500 cursor-not-allowed">
            CURRENT BASE SYSTEM
          </div>
        </div>

        {/* KARTU 2: WHALE PRO PREMIUM PACKAGE */}
        <div className="bg-cyber-dark border-2 border-cyber-neon p-5 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative">
          <div className="absolute -top-3.5 right-6 bg-cyber-neon text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest flex items-center gap-1 shadow-[0_0_10px_#8B5CF6]">
            <Sparkles className="w-3 h-3" /> RECOMMENDED
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-cyber-neon tracking-widest block uppercase">
              QUANTUM CORRIDOR
            </span>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              WHALE PRO
            </h3>

            <div className="text-3xl font-black text-cyber-cyan">
              IDR 220,000{" "}
              <span className="text-xs text-gray-400 font-normal">
                / LIFETIME ACCESS
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Buka kunci penuh radar kecerdasan buatan untuk mengamati arah
              psikologi Whale market secara objektif.
            </p>
            <ul className="space-y-3 pt-4 border-t border-gray-800 text-xs text-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0" />{" "}
                Seluruh Fitur Paket Free Member Aktif
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0" />{" "}
                Analisis AI Tanpa Batas untuk Semua Koin
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0" />{" "}
                Premium Deep Dive & Strategi Entri Rahasia
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-cyan flex-shrink-0" />{" "}
                Pemantauan Kode Komit GitHub Developer Live
              </li>
            </ul>
          </div>

          {/* Tombol Eksekusi Pembayaran */}
          {user &&
          (String(user.isPremium) === "true" || user.isPremium === true) ? (
            /* Blokir Pembayaran Ganda Jika Sudah Premium */
            <div className="w-full py-3.5 bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30 text-center text-xs font-bold rounded-xl flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> TRANSMISSION ACCESS LICENSED
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px #8B5CF6" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3.5 bg-cyber-neon text-white font-black text-xs rounded-xl tracking-widest flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-cyber-cyan fill-cyber-cyan animate-pulse" />
              {loading ? "INITIALIZING HUB..." : "UPGRADE TO WHALE PRO NOW"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
