import { motion } from "motion/react";
import {
  Info,
  ShieldCheck,
  Plus,
  Coins,
  Sparkles,
  Radio,
  Bot,
  Trophy,
  LineChart,
  Zap,
  CheckCircle2,
  HelpCircle,
  Award,
  ArrowRight,
  Globe,
  Share2,
} from "lucide-react";

export default function Information() {
  const featuresGuide = [
    {
      title: "1. Radar Pasar (Dashboard Utama)",
      icon: <LineChart className="w-5 h-5 text-cyber-cyan" />,
      desc: "Pusat pemantauan pergerakan harga 30+ aset kripto terpopuler secara real-time.",
      details: [
        "Ticker Live: Baris running text harga dan perubahan 24 jam di bagian atas.",
        "Kategori Klaster: Filter koin berdasarkan sektor (Layer 1, Layer 2, Meme Coins, AI).",
        "Tabel Harga Live: Menampilkan peringkat market cap, harga terkini (USD), dan persentase tren naik/turun.",
      ],
    },
    {
      title: "2. Tombol Tambah Pantauan (+)",
      icon: <Plus className="w-5 h-5 text-cyber-emerald" />,
      desc: "Tombol (+) berwarna biru cyan pada setiap baris koin di tabel pasar.",
      details: [
        "Fungsi: Mengunci koin pilihan Anda secara langsung ke halaman 'Daftar Pantauan Saya'.",
        "Tujuan: Memudahkan pelacakan taktis koin-koin favorit Anda tanpa harus mencarinya ulang.",
      ],
    },
    {
      title: "3. Daftar Pantauan Saya & Audit Portofolio AI",
      icon: <Coins className="w-5 h-5 text-cyber-pink" />,
      desc: "Ruang kendali khusus untuk mengelola koin yang Anda pantau.",
      details: [
        "Catatan Instruksi Taktis: Anda dapat menuliskan catatan strategi entri/exit pribadi pada setiap kartu koin.",
        "Tombol Audit Portofolio AI: Fitur cerdas yang menganalisis seluruh koin pantauan Anda sekaligus.",
        "Skor Risiko Exposure (1-100): Mengukur seberapa spekulatif portofolio Anda dan memberikan saran rebalancing strategis.",
      ],
    },
    {
      title: "4. Radar Transaksi Paus (Whale Radar Alert)",
      icon: <Radio className="w-5 h-5 text-cyber-neon" />,
      desc: "Sistem deteksi transaksi raksasa dompet paus bernilai jutaan dolar secara real-time.",
      details: [
        "Sinyal Exchange Deposit: Menandai perpindahan dana besar ke bursa (potensi tekanan jual / dump).",
        "Sinyal Cold Storage Withdrawal: Menandai penarikan dana ke dompet dingin (sinyal akumulasi bullish institusi).",
        "Evaluasi Risiko AI: Ringkasan singkat potensi dampak transaksi tersebut terhadap pergerakan pasar.",
      ],
    },
    {
      title: "5. Whale Copilot AI (Asisten Chatbot Interaktif)",
      icon: <Bot className="w-5 h-5 text-cyber-cyan font-bold" />,
      desc: "Chatbot AI cerdas mengambang di sudut kanan bawah aplikasi.",
      details: [
        "Konsultasi Bebas: Anda dapat bertanya seputar strategi trading, analisis teknikal/fundamental, atau saran manajemen risiko.",
        "Quick Prompt Shortcuts: Tombol pintas pertanyaan instan untuk analisis koin terbaik minggu ini.",
        "Ditenagai Neural Core Llama 3.1 & Gemini.",
      ],
    },
    {
      title: "6. Simulasi Trading Virtual (PUMP / DUMP)",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      desc: "Arena uji insting trading tanpa risiko kehilangan uang sungguhan.",
      details: [
        "Saldo Virtual $5,000: Modal awal simulasi trading Anda.",
        "Prediksi Arah 1 Menit: Pilih koin target, lalu kunci posisi PUMP (Harga Naik) atau DUMP (Harga Turun).",
        "Hasil Profit & Poin XP: Kemenangan memberikan profit +$500 dan +15 XP untuk menaikkan Level Trader Anda.",
      ],
    },
    {
      title: "7. Papan Peringkat Paus (Leaderboard)",
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      desc: "Papan kompetisi global trader virtual teratas.",
      details: [
        "Sistem Ranking: Diurutkan berdasarkan Saldo Virtual Cash dan Level Trader.",
        "Gelar Badge Kehormatan: Apex Titan (#1), Whale Lord (#2-3), Market Shark (#4-10), Cyber Dolphin (#11-20), dan Shrimp.",
        "Log Riwayat Trading: Tab khusus untuk melihat riwayat lengkap taruhan posisi PUMP/DUMP Anda.",
      ],
    },
    {
      title: "8. Detail Koin & Bagikan Kartu Sinyal AI",
      icon: <Sparkles className="w-5 h-5 text-cyber-neon" />,
      desc: "Analisis klinis mendalam untuk setiap aset kripto.",
      details: [
        "Grafik Harga Historis 7 Hari: Menampilkan grafik pergerakan harga riil berbasis koordinat Recharts.",
        "Dev Code Monitor: Memantau aktivitas komit pengodean repositori GitHub resmi proyek.",
        "Tombol Bagikan Kartu AI: Membuat kartu infografis sinyal AI yang siap disalin dan dibagikan ke media sosial (X/Twitter, Telegram).",
      ],
    },
    {
      title: "9. Upgrade Whale Pro",
      icon: <Award className="w-5 h-5 text-cyber-neon" />,
      desc: "Keanggotaan premium untuk membuka kunci seluruh fitur eksklusif tanpa batas.",
      details: [
        "Akses Analisis AI Semua Koin: Membuka kunci analisis AI untuk altcoin selain Bitcoin & Ethereum.",
        "Pembayaran Otomatis Midtrans: Proses transaksi Snap instan dan aman.",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-8 font-mono"
    >
      {/* Header Utama Halaman Informasi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-dark/60 border border-gray-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/30 text-cyber-cyan">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              INFORMASI & PANDUAN PENGGUNA
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Panduan lengkap fungsi setiap fitur, tombol, dan informasi
              pengembang platform
            </p>
          </div>
        </div>
      </div>

      {/* SEGMENT 1: TENTANG APLIKASI WHALEWATCH AI */}
      <div className="bg-gradient-to-r from-cyber-dark via-cyber-dark/80 to-cyber-cyan/10 border border-cyber-cyan/30 p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-cyber-cyan text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
          <span>SISTEM INTELIJEN KRIPTO BERBASIS AI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Apa itu WhaleWatch AI?
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
          <strong>WhaleWatch AI</strong> adalah platform intelijen
          cryptocurrency dan simulasi pasar modern yang dirancang untuk membantu
          trader maupun pemula memantau pergerakan bursa global. Dengan
          memanfaatkan perpaduan{" "}
          <strong>Neural Core AI (Groq Llama 3.1 & Gemini)</strong> dan data
          blockchain teragregasi, aplikasi ini membantu Anda mendeteksi arah
          sentimen pasar, memantau dompet transaksi paus raksasa, serta menguji
          strategi trading secara aman tanpa risiko finansial sungguhan.
        </p>
      </div>

      {/* SEGMENT 2: PANDUAN DETIL SETIAP FITUR DAN TOMBOL */}
      <div className="space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyber-cyan" /> PANDUAN
            PENGGUNAAN FITUR & TOMBOL APLIKASI
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Penjelasan fungsi dan guna dari setiap komponen dalam aplikasi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresGuide.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-cyber-dark/80 border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-cyber-cyan/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyber-bg border border-gray-800 rounded-xl">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-white text-sm leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-bold border-b border-gray-800/80 pb-3">
                  {item.desc}
                </p>
                <ul className="space-y-2 text-[11px] text-gray-400">
                  {item.details.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SEGMENT 3: INFORMASI PENGEMBANG (DEVELOPER CREDENTIALS) */}
      <div className="bg-cyber-dark border border-gray-800 p-8 rounded-3xl space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <Award className="w-5 h-5 text-cyber-neon" /> INFORMASI PENGEMBANG
            (DEVELOPER CREDENTIALS)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Platform ini dirancang, dikembangkan, dan dipelihara secara penuh
            oleh pengembang
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {/* Instagram */}
          <a
            href="https://instagram.com/malthafkitam"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-cyber-bg border border-gray-800 rounded-2xl hover:border-pink-500/50 transition-all flex items-center gap-4 group"
          >
            <div className="p-3.5 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-500 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-bold">
                INSTAGRAM PENGEMBANG:
              </span>
              <span className="text-base font-black text-white group-hover:text-pink-400 transition-colors">
                @malthafkitam
              </span>
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/malthafkiram"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-cyber-bg border border-gray-800 rounded-2xl hover:border-cyber-cyan/50 transition-all flex items-center gap-4 group"
          >
            <div className="p-3.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-xl text-cyber-cyan group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-bold">
                GITHUB REPOSITORI:
              </span>
              <span className="text-base font-black text-white group-hover:text-cyber-cyan transition-colors">
                @malthafkiram
              </span>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
