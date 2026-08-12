import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
} from "recharts";
import {
  Cpu,
  Globe,
  ShieldAlert,
  ArrowLeft,
  Lock,
  Share2,
  Copy,
  Check,
  Sparkles,
  X,
  Building2,
  MapPin,
  Zap,
  Target,
  Rocket,
  Compass,
  BarChart3,
  Calendar,
  ExternalLink,
  Code2,
  Newspaper,
  Layers,
  Coins,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
} from "lucide-react";
import SentimentBar from "../components/SentimentBar.jsx";
import api from "../utils/api.js";
import { formatCryptoPrice } from "../utils/formatters.js";

/**
 * Helper Metadata Kamus Fundamental Proyek Kripto 100% Bahasa Indonesia
 * Mengembalikan Profil Perusahaan, Lokasi Markas, Token Utility, Konsensus, Visi Misi & Roadmap & Narasi Deskripsi
 */
const getCoinFundamentalInfo = (coinId, coinName, symbol, categories = []) => {
  const id = coinId?.toLowerCase() || "";

  const metadata = {
    bitcoin: {
      indonesianDescription:
        "Bitcoin (BTC) adalah mata uang kripto terdesentralisasi pertama di dunia yang diciptakan pada tahun 2009 oleh pencipta anonim berorientasi samaran Satoshi Nakamoto. Bitcoin beroperasi pada jaringan peer-to-peer terdesentralisasi tanpa perantara atau bank sentral. Menggunakan mekanisme konsensus Proof-of-Work (PoW) berbasis algoritma SHA-256, Bitcoin dirancang dengan jumlah pasokan terbatas sebanyak 21 juta koin yang menjadikannya sebagai penyimpan nilai digital (Emas Digital) paling aman di dunia.",
      developerOrg: "Satoshi Nakamoto & Komunitas Pengembang Global",
      headquartersLocation: "Jaringan Terdesentralisasi Global (Tanpa Kantor Pusat)",
      tokenUtility: "Store of Value Digital (Emas Digital) & Sistem Pembayaran P2P Bebas Inflasi",
      consensusType: "Proof of Work (PoW) - SHA-256",
      visionMission: "Menjadi aset moneter digital terdesentralisasi pertama di dunia yang bebas dari monopoli bank sentral dan sensor geopolitik global.",
      futureRoadmap: "Skalabilitas Layer-2 Lightning Network, integrasi Taproot Assets, dan adopsi cadangan devisa negara/institusi global.",
    },
    ethereum: {
      indonesianDescription:
        "Ethereum (ETH) adalah platform blockchain terdesentralisasi open-source yang menggabungkan fungsionalitas smart contract. Didesain oleh Vitalik Buterin pada tahun 2015, Ethereum memungkinkan para pengembang di seluruh dunia untuk membangun dan menjalankan aplikasi terdesentralisasi (dApps), protokol Finansial Terdesentralisasi (DeFi), NFT, dan organisasi otonom (DAO) tanpa risiko kecurangan, downtime, atau campur tangan pihak ketiga.",
      developerOrg: "Ethereum Foundation (Vitalik Buterin & Tim Pengembang Core)",
      headquartersLocation: "Zug, Swiss (Ethereum Foundation HQ)",
      tokenUtility: "Biaya Gas Eksekusi Smart Contract, Staking Validator Consensus, & Agregasi Liquidity DeFi",
      consensusType: "Proof of Stake (PoS) - Casper Consensus",
      visionMission: "Menjadi Komputer Dunia (World Computer) terdesentralisasi yang menjalankan aplikasi ekosistem tanpa risiko downtime atau campur tangan pihak ketiga.",
      futureRoadmap: "Transisi penuh Roadmap Danksharding & PeerDAS untuk menurunkan biaya L2 rollup mendekati nol, serta verifikasi Verkle Trees.",
    },
    solana: {
      indonesianDescription:
        "Solana (SOL) adalah platform blockchain layer-1 performa tinggi yang dirancang untuk mendukung adopsi massal Web3 dan aplikasi terdesentralisasi berskala besar. Diciptakan oleh Anatoly Yakovenko pada tahun 2020, Solana menggabungkan konsensus Proof-of-History (PoH) dengan Proof-of-Stake (PoS) untuk menghasilkan throughput transaksi lebih dari 50.000 TPS dengan biaya gas transaksi mendekati nol dolar.",
      developerOrg: "Solana Labs Inc. & Solana Foundation (Anatoly Yakovenko)",
      headquartersLocation: "San Francisco, California, Amerika Serikat",
      tokenUtility: "Gas Fee Transaksi Kecepatan Tinggi, Staking Node Validator, & Pembayaran DApp",
      consensusType: "Proof of History (PoH) + Proof of Stake (PoS)",
      visionMission: "Menyediakan blockchain skala finansial global yang mampu memproses puluhan ribu transaksi per detik dengan biaya mikro desimal.",
      futureRoadmap: "Peluncuran validator client Firedancer oleh Jump Crypto untuk mencapai 1 Juta TPS dan ketahanan jaringan kelas institusional.",
    },
    ripple: {
      indonesianDescription:
        "XRP adalah aset digital terdesentralisasi yang dirancang khusus untuk meningkatkan efisiensi sistem pembayaran dan transfer uang internasional lintas negara. Dikelola oleh Ripple Labs, XRP Ledger memungkinkan penyelesaian transaksi antar bank dan lembaga keuangan global hanya dalam 3-5 detik dengan biaya transaksi yang sangat murah.",
      developerOrg: "Ripple Labs Inc. (Brad Garlinghouse & Chris Larsen)",
      headquartersLocation: "San Francisco, California, Amerika Serikat",
      tokenUtility: "Jembatan Likuiditas Pembayaran Lintas Negara (Cross-Border Remittance) Lembaga Perbankan",
      consensusType: "XRPL Federated Consensus Protocol",
      visionMission: "Mengubah sistem pembayaran perbankan global (pengganti SWIFT) agar menjadi instan, efisien, dan berbiaya rendah.",
      futureRoadmap: "Integrasi Tokenisasi Aset Dunia Nyata (RWA), peluncuran Stablecoin RLUSD, dan ekspansi lisensi perbankan global.",
    },
    arbitrum: {
      indonesianDescription:
        "Arbitrum (ARB) adalah solusi skalabilitas Layer-2 untuk Ethereum yang menggunakan teknologi Optimistic Rollup. Dikembangkan oleh Offchain Labs, Arbitrum memungkinkan eksekusi transaksi yang jauh lebih cepat dan hemat biaya dengan tetap mewarisi tingkat keamanan penuh dari jaringan utama Ethereum.",
      developerOrg: "Offchain Labs Inc. & Arbitrum DAO",
      headquartersLocation: "New York, NY, Amerika Serikat",
      tokenUtility: "Governance Voting Arbitrum DAO, Gas Fee Orbit Chains, & Insentif Ekosistem L2",
      consensusType: "Layer-2 Optimistic Rollup (Ethereum Security)",
      visionMission: "Menskala ekosistem Ethereum dengan transaksi super cepat dan murah tanpa mengorbankan keamanan Layer-1.",
      futureRoadmap: "Peluncuran Stylus (Dukungan C/C++/Rust di EVM), desentralisasi penuh Sequencer, dan ekspansi Orbit Layer-3 chains.",
    },
    "polygon-ecosystem-token": {
      indonesianDescription:
        "Polygon (POL) adalah ekosistem infrastruktur terdesentralisasi yang menghubungkan jaringan blockchain berbasis ZK-Rollup melalui arsitektur AggLayer. Polygon memberikan skalabilitas tanpa batas bagi aplikasi Web3 dan pengembang smart contract.",
      developerOrg: "Polygon Labs (Sandeep Nailwal & Jaynti Kanani)",
      headquartersLocation: "Singapura / Global",
      tokenUtility: "Staking Validator Hub 2.0, Gas Fee Polygon zkEVM & AggLayer Interoperability",
      consensusType: "Proof of Stake & ZK-Rollup AggLayer",
      visionMission: "Membangun Value Layer di atas Internet melalui agregasi jaringan ZK-Rollup yang terinterkoneksi secara mulus.",
      futureRoadmap: "Migrasi penuh POL tokenomics, integrasi AggLayer lintas rantai, dan prover ZK generasi berikutnya.",
    },
    dogecoin: {
      indonesianDescription:
        "Dogecoin (DOGE) adalah mata uang kripto open-source berbasis meme komedi pertama di dunia yang dibuat pada tahun 2013 oleh Billy Markus dan Jackson Palmer. Memiliki komunitas global terbesar, Dogecoin banyak digunakan untuk pembayaran mikro dan tipping media sosial.",
      developerOrg: "Dogecoin Foundation (Billy Markus, Jackson Palmer & Komunitas Global)",
      headquartersLocation: "Komunitas Terdesentralisasi Global",
      tokenUtility: "Mata Uang Mikro Tipping Media Sosial, Pembayaran E-commerce, & Transfer Antar Dompet",
      consensusType: "Proof of Work (AuxPoW / Scrypt Shared Mining dengan Litecoin)",
      visionMission: "Menjadi mata uang internet paling ramah, menyenangkan, dan digunakan secara luas untuk transaksi sehari-hari.",
      futureRoadmap: "Pengembangan LibDogecoin SDK untuk kemudahan integrasi merchant dan optimasi transaksi mikro.",
    },
    pepe: {
      indonesianDescription:
        "Pepe (PEPE) adalah token meme terdesentralisasi yang dibangun di atas blockchain Ethereum sebagai bentuk penghormatan pada budaya meme internet Pepe the Frog. Pepe beroperasi tanpa pajak transaksi dan sepenuhnya digerakkan oleh kekuatan komunitas Web3.",
      developerOrg: "Komunitas Pepe Protocol & Kontributor Komunitas Web3",
      headquartersLocation: "Komunitas Terdesentralisasi Global",
      tokenUtility: "Token Budaya Meme, Perdagangan Komunitas, & Insentif Likuiditas DEX",
      consensusType: "ERC-20 Token (Pengamanan Konsensus Ethereum)",
      visionMission: "Menjadi raja token meme berbasis budaya pop kultural internet yang 100% didorong oleh kekuatan komunitas murni.",
      futureRoadmap: "Ekspansi kemitraan ekosistem Web3, inisiatif bot DeFi komunitas, dan pembaruan struktur likuiditas.",
    },
    bittensor: {
      indonesianDescription:
        "Bittensor (TAO) adalah protokol open-source yang memperkuat jaringan pembelajaran mesin (Machine Learning) terdesentralisasi. Bittensor memungkinkan pengembang AI membagikan model komputasi neural secara global dan menerima imbalan token TAO.",
      developerOrg: "Opentensor Foundation (Jacob Steeves & Ala Shaabana)",
      headquartersLocation: "Toronto, Kanada / Global",
      tokenUtility: "Insentif Model Kecerdasan Buatan (AI), Akses Subnet GPU Compute, & Staking Neural Node",
      consensusType: "Proof of Intelligence (PoI) Subnet Protocol",
      visionMission: "Demokratisasi pengembangan Kecerdasan Buatan (AI) terdesentralisasi yang menandingi komputasi raksasa monopolitis.",
      futureRoadmap: "Peluncuran Subnet dApps AI baru (text, image, audio generation) dan integrasi agen AI terdesentralisasi.",
    },
    "render-token": {
      indonesianDescription:
        "Render Network (RENDER) adalah penyedia solusi rendering GPU terdesentralisasi yang menghubungkan seniman digital dan pembuat animasi 3D/VFX dengan penyedia daya komputasi GPU menganggur di seluruh dunia.",
      developerOrg: "Render Network Foundation & OTOY Inc. (Jules Urbach)",
      headquartersLocation: "Los Angeles, California, AS",
      tokenUtility: "Pembayaran Rendering 3D/VFX, Penyewaan GPU Compute, & Insentif Node Provider",
      consensusType: "Proof of Render (PoR) Solana Ecosystem",
      visionMission: "Menyediakan infrastruktur komputasi GPU terdesentralisasi untuk industri metaverse, AI, dan efek visual 3D skala bioskop.",
      futureRoadmap: "Integrasi rendering AI Generatif tingkat tinggi dan ekspansi infrastruktur node komputasi enterprise.",
    },
    "fetch-ai": {
      indonesianDescription:
        "Fetch.ai (FET) adalah jaringan kecerdasan buatan terdesentralisasi yang memanfaatkan Autonomous Economic Agents (AEA) untuk mengotomatisasi transaksi bisnis, manajemen pasokan, dan layanan ekonomi tanpa campur tangan manusia.",
      developerOrg: "Artificial Superintelligence (ASI) Alliance (Humayun Sheikh)",
      headquartersLocation: "Cambridge, Inggris (UK)",
      tokenUtility: "Deploy & Eksekusi Autonomous Economic Agents (AEA), Staking Node AI",
      consensusType: "Proof of Stake (Cosmos SDK Based)",
      visionMission: "Menciptakan jaringan agen AI otonom yang dapat melakukan transaksi bisnis secara otomatis tanpa campur tangan manusia.",
      futureRoadmap: "Penggabungan penuh aliansi ASI (Fetch.ai, SingularityNET, Ocean Protocol) menjadi super-intelligence AI terkuat.",
    },
  };

  if (metadata[id]) {
    return metadata[id];
  }

  const categoryStr = categories.join(", ") || "Kripto Terdesentralisasi";
  return {
    indonesianDescription: `${coinName} (${symbol}) adalah aset kripto terdesentralisasi yang dikembangkan untuk memfasilitasi transaksi digital aman dan terpercaya pada ekosistem ${categoryStr}.`,
    developerOrg: `${coinName} Core Foundation & Open-Source Community`,
    headquartersLocation: "Jaringan Terdesentralisasi Global",
    tokenUtility: `Utility Token Ekosistem ${coinName} untuk Transaksi, Staking, dan Insentif Protokol`,
    consensusType: categoryStr.includes("Layer 1")
      ? "Proof of Stake (PoS)"
      : "Smart Contract Token Protocol",
    visionMission: `Mengakselerasi adopsi Web3 dan menyediakan solusi terdesentralisasi pada sektor ${categoryStr}.`,
    futureRoadmap: `Pengembangan ekspansi ekosistem ${symbol}, optimasi skalabilitas transaksi, dan kemitraan strategi global.`,
  };
};

export default function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [coinData, setCoinData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartDays, setChartDays] = useState("7"); // '0.5' | '1' | '2' | '3' | '7'
  const [chartLoading, setChartLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'blueprint' | 'devnews'

  const isLocked =
    (!user || String(user.isPremium) === "false") &&
    coinId !== "bitcoin" &&
    coinId !== "ethereum";

  const timeFrameOptions = [
    { label: "12 JAM", value: "0.5" },
    { label: "1 HARI", value: "1" },
    { label: "2 HARI", value: "2" },
    { label: "3 HARI", value: "3" },
    { label: "7 HARI", value: "7" },
  ];

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setAiError(null);
        setAiData(null);

        const [detailRes, chartRes] = await Promise.all([
          api.get(`/api/coins/detail/${coinId}`),
          api
            .get(`/api/coins/chart/${coinId}?days=7`)
            .catch(() => ({ data: { data: [] } })),
        ]);

        setCoinData(detailRes.data.data);
        if (chartRes.data?.data && chartRes.data.data.length > 0) {
          setChartData(chartRes.data.data);
        } else {
          const sampleChart = Array.from({ length: 7 }, (_, i) => ({
            day: `Hari ${i + 1}`,
            Price:
              (detailRes.data.data.market_stats?.current_price || 100) *
              (1 + (Math.random() * 0.04 - 0.02)),
          }));
          setChartData(sampleChart);
        }

        if (!isLocked) {
          try {
            const aiRes = await api.get(`/api/ai/analyze/${coinId}`);
            setAiData(aiRes.data.data);
          } catch (aiErr) {
            const msg = aiErr.response?.data?.message;
            setAiError(
              Array.isArray(msg)
                ? msg.join(", ")
                : msg || "Analisis AI gagal dimuat.",
            );
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal memuat detail data koin.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [coinId, isLocked]);

  const handleTimeframeChange = async (days) => {
    try {
      setChartDays(days);
      setChartLoading(true);
      setZoomLevel(1);
      const chartRes = await api.get(`/api/coins/chart/${coinId}?days=${days}`);
      if (chartRes.data?.data && chartRes.data.data.length > 0) {
        setChartData(chartRes.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil grafik rentang waktu:", days, err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleCopyCardText = () => {
    const shareText = `🚀 WHALEWATCH AI REPORT: ${coinData?.name} (${coinData?.symbol}) 🚀\n\nHarga Live: ${formatCryptoPrice(coinData?.market_stats?.current_price)}\nRekomendasi AI: ${aiData?.ai_analysis?.recommendation || "HOLD"}\nSentimen: ${aiData?.ai_analysis?.sentiment || "Netral"}\n\nAnalisis AI: "${aiData?.ai_analysis?.analysis || "N/A"}"\n\nPelajari selengkapnya di WhaleWatch.AI!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="p-8 sm:p-12 text-center text-cyber-cyan font-mono tracking-widest animate-pulse space-y-3">
        <Cpu className="w-10 h-10 mx-auto animate-spin text-cyber-neon" />
        <p className="text-sm">MEMBONGKAR CETAK BIRU TELEMETRI BLOCKCHAIN...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 sm:p-12 text-center text-cyber-rose font-mono space-y-4 max-w-xl mx-auto">
        <p className="text-sm bg-cyber-rose/10 border border-cyber-rose/30 p-4 rounded-xl">[ERROR]: {error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-cyber-cyan text-cyber-dark font-bold text-xs rounded-xl cursor-pointer"
        >
          KEMBALI KE RADAR PASAR
        </button>
      </div>
    );
  }

  const getActionColor = (action) => {
    if (action === "BUY" || action === "BELI")
      return "text-cyber-emerald border-cyber-emerald bg-cyber-emerald/10";
    if (action === "SELL" || action === "JUAL")
      return "text-cyber-rose border-cyber-rose bg-cyber-rose/10";
    return "text-cyber-amber border-cyber-amber bg-cyber-amber/10";
  };

  const fundamentalMeta = getCoinFundamentalInfo(
    coinData?.id,
    coinData?.name,
    coinData?.symbol,
    coinData?.categories,
  );

  const circulating = coinData?.supply?.circulating_supply;
  const maxSupply = coinData?.supply?.max_supply || coinData?.supply?.total_supply;
  const supplyRatio = circulating && maxSupply ? Math.min((circulating / maxSupply) * 100, 100) : null;

  const getZoomedChartData = () => {
    if (!chartData || chartData.length === 0) return [];
    if (zoomLevel === 1) return chartData;
    const itemsToKeep = Math.max(Math.floor(chartData.length / zoomLevel), 5);
    return chartData.slice(chartData.length - itemsToKeep);
  };

  const displayChartData = getZoomedChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6 font-mono text-white"
    >
      {/* TOMBOL BACK NAVIGASI */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-cyber-cyan" /> KEMBALI KE RADAR PASAR
      </button>

      {/* HEADER DINAMIS UTAMA KOIN */}
      <div className="bg-cyber-dark/80 backdrop-blur-md border border-gray-800/80 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-neon to-transparent opacity-60" />

        <div className="flex items-center gap-4">
          <img
            src={coinData?.image}
            alt={coinData?.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 border-cyber-cyan/40 p-1 bg-cyber-bg shadow-[0_0_20px_rgba(6,182,212,0.2)] flex-shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-black tracking-wide text-white">
                {coinData?.name}
              </h1>
              <span className="px-2.5 py-0.5 bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-bold rounded-lg uppercase tracking-widest">
                {coinData?.symbol}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-400">
              {coinData?.categories?.[0] && (
                <span className="px-2 py-0.5 bg-cyber-bg border border-gray-800 rounded text-gray-300 font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyber-neon" /> {coinData.categories[0]}
                </span>
              )}
              {coinData?.genesis_date && (
                <span className="px-2 py-0.5 bg-cyber-bg border border-gray-800 rounded text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyber-cyan" /> Rilis: {coinData.genesis_date}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-800/60">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-gray-400 block tracking-widest uppercase">
              HARGA INDEKS LIVE
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formatCryptoPrice(coinData?.market_stats?.current_price)}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  (coinData?.market_stats?.price_change_percentage_24h || 0) >= 0
                    ? "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald"
                    : "bg-cyber-rose/10 border-cyber-rose text-cyber-rose"
                }`}
              >
                {(coinData?.market_stats?.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
                {coinData?.market_stats?.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          </div>

          {!isLocked && (
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <Share2 className="w-4 h-4" /> BAGIKAN KARTU AI
            </button>
          )}
        </div>
      </div>

      {/* TAB SELECTOR RESPONSIVE */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-cyber-dark border border-gray-800 rounded-xl">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-2.5 px-3 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "overview"
              ? "bg-cyber-cyan text-cyber-dark font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0" /> <span className="hidden sm:inline">PASAR &</span> GRAFIK
        </button>

        <button
          onClick={() => setActiveTab("blueprint")}
          className={`py-2.5 px-3 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "blueprint"
              ? "bg-cyber-cyan text-cyber-dark font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4 flex-shrink-0" /> FUNDAMENTAL <span className="hidden sm:inline">& VISI</span>
        </button>

        <button
          onClick={() => setActiveTab("devnews")}
          className={`py-2.5 px-3 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "devnews"
              ? "bg-cyber-cyan text-cyber-dark font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Code2 className="w-4 h-4 flex-shrink-0" /> KODE <span className="hidden sm:inline">& BERITA</span>
        </button>
      </div>

      {/* MODAL EKSPOR SINYAL AI */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-cyber-dark border border-cyber-cyan/40 rounded-2xl overflow-hidden shadow-2xl p-5 sm:p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyber-neon" /> EKSPOR KARTU SINYAL AI
              </span>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-cyber-dark to-cyber-bg border border-cyber-cyan/30 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <img src={coinData?.image} className="w-8 h-8 rounded-full" alt="coin" />
                  <div>
                    <h4 className="font-black text-white text-sm">{coinData?.name}</h4>
                    <span className="text-[10px] text-cyber-cyan">[{coinData?.symbol}]</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-black text-xs rounded-lg">
                  {aiData?.ai_analysis?.recommendation || "HOLD"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Harga Indeks Live:</span>
                  <span className="text-white font-bold">{formatCryptoPrice(coinData?.market_stats?.current_price)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sentimen Pasar:</span>
                  <span className="text-cyber-neon font-bold">{aiData?.ai_analysis?.sentiment || "Netral"}</span>
                </div>
              </div>

              <div className="p-3 bg-cyber-dark rounded-xl border border-gray-800 text-gray-300 text-xs italic leading-relaxed">
                "{aiData?.ai_analysis?.analysis || "Analisis neural sedang aktif..."}"
              </div>

              <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
                <span>WHALEWATCH AI NEURAL CORE</span>
                <span className="text-cyber-emerald font-bold">TERVERIFIKASI</span>
              </div>
            </div>

            <button
              onClick={handleCopyCardText}
              className="w-full py-3 bg-cyber-cyan text-cyber-dark font-black rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              {copied ? "BERHASIL DISALIN KE CLIPBOARD!" : "SALIN TEKS SINYAL AI UNTUK SOSMED"}
            </button>
          </motion.div>
        </div>
      )}

      {/* KONTEN TAB 1: GRAFIK & ANALISIS PASAR */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Visualisasi Grafik Recharts + Controls */}
          <div className="lg:col-span-2 bg-cyber-dark border border-gray-800 p-4 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            {/* Header & Controls Baris Atas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
              <h3 className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-cyan" /> GRAFIK HARGA HISTORIS
              </h3>

              {/* Kontrol Zoom In / Zoom Out */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-[10px] text-gray-500 font-bold mr-1 hidden sm:inline">ZOOM:</span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(prev * 1.5, 4))}
                  className="px-2 py-1 bg-cyber-bg border border-gray-800 hover:border-cyber-cyan text-cyber-cyan rounded-lg transition-all flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> <span className="hidden sm:inline">+</span>
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(prev / 1.5, 1))}
                  className="px-2 py-1 bg-cyber-bg border border-gray-800 hover:border-cyber-cyan text-cyber-cyan rounded-lg transition-all flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">-</span>
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-1 bg-cyber-bg border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white rounded-lg transition-all flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">RESET</span>
                </button>
              </div>
            </div>

            {/* Baris Tombol Selector Rentang Waktu (12J, 1H, 2H, 3H, 7H) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 pr-1 flex-shrink-0">
                <Clock className="w-3 h-3 text-cyber-cyan" /> WAKTU:
              </span>
              {timeFrameOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleTimeframeChange(opt.value)}
                  disabled={chartLoading}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                    chartDays === opt.value
                      ? "bg-cyber-cyan text-cyber-dark border-cyber-cyan font-black shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-cyber-bg/60 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                  } ${chartLoading ? "opacity-50 cursor-wait" : ""}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* AREA GRAFIK HARGA RECHARTS + BRUSH SLIDER */}
            <div className="w-full h-[280px] sm:h-[350px] bg-cyber-bg/50 rounded-xl p-2 border border-gray-900 relative">
              {chartLoading && (
                <div className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-sm z-10 flex items-center justify-center text-cyber-cyan font-mono text-xs animate-pulse">
                  MEMATRI GRAFIK RENTANG WAKTU BARU...
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={10}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0F19",
                      borderColor: "#1E293B",
                      color: "#FFF",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Price"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Brush
                    dataKey="day"
                    height={24}
                    stroke="#06B6D4"
                    fill="#0B0F19"
                    tickFormatter={() => ""}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-500 text-center italic">
              💡 Geser slider biru di bawah grafik untuk Zoom In / Zoom Out jendela waktu secara bebas.
            </p>
          </div>

          {/* Kolom Kanan: Kotak Radar AI & Sentimen (Sangat Responsif di Android/Tablet) */}
          <div className="bg-cyber-dark border border-gray-800 p-4 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[380px] sm:min-h-[420px]">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider flex items-center gap-2 mb-4 border-b border-gray-800/80 pb-3">
              <ShieldAlert className="w-4 h-4 text-cyber-neon" /> RADAR SENTIMEN AI
            </h3>

            {/* JIKA AKSES AI TERKUNCI (OVERLAY LAYAR MULTI-DEVICE 100% RESPONSIVE) */}
            {isLocked && (
              <div className="absolute inset-0 bg-cyber-dark/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-cyber-neon/10 rounded-2xl border border-cyber-neon text-cyber-neon shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                </div>
                <h4 className="text-white font-black text-sm sm:text-lg tracking-wide">
                  ANALISIS AI TERKUNCI
                </h4>
                <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed max-w-xs">
                  Fitur evaluasi psikologis pasar bertenaga AI untuk koin selain Bitcoin & Ethereum khusus bagi anggota kelas Whale Pro.
                </p>
                <button
                  onClick={() => navigate("/upgrade")}
                  className="w-full sm:w-auto px-5 py-2.5 bg-cyber-neon text-white font-black text-xs rounded-xl tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-purple-600 transition-all cursor-pointer"
                >
                  UPGRADE KE PRO
                </button>
              </div>
            )}

            {aiData?.ai_analysis ? (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="text-center p-4 border-2 rounded-2xl border-dashed tracking-widest bg-cyber-bg/40">
                  <span className="text-[10px] text-gray-400 block mb-1 uppercase">
                    REKOMENDASI EKSEKUSI AI
                  </span>
                  <span
                    className={`text-2xl sm:text-3xl font-black px-4 py-1 rounded-md ${getActionColor(aiData.ai_analysis?.recommendation)}`}
                  >
                    {aiData.ai_analysis?.recommendation || "HOLD"}
                  </span>
                </div>

                <SentimentBar
                  score={
                    aiData.ai_analysis?.sentimentScore ||
                    (aiData.ai_analysis?.sentiment === "Bullish"
                      ? 80
                      : aiData.ai_analysis?.sentiment === "Bearish"
                        ? 20
                        : 50)
                  }
                  status={aiData.ai_analysis?.sentiment?.toUpperCase()}
                />

                <div className="bg-cyber-bg border border-gray-800 p-4 rounded-xl text-xs text-gray-300 leading-relaxed flex flex-col gap-1.5">
                  <span className="text-cyber-neon font-bold block text-[11px]">
                    ARGUMEN KLINIS AI:
                  </span>
                  <div className="max-h-48 overflow-y-auto pr-1 custom-scrollbar text-gray-400">
                    "{aiData?.ai_analysis?.analysis || aiData?.ai_analysis?.premium_deep_dive || "Memindai klaster data..."}"
                  </div>
                </div>
              </div>
            ) : aiError ? (
              <div className="text-cyber-rose text-xs text-center py-12 px-4">
                {aiError}
              </div>
            ) : (
              <div className="text-gray-500 text-xs text-center py-12">
                Menunggu pasokan sinyal AI...
              </div>
            )}
          </div>
        </div>
      )}

      {/* KONTEN TAB 2: CETAK BIRU FUNDAMENTAL & VISI MISI */}
      {activeTab === "blueprint" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-cyber-dark border border-gray-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase">
                <Building2 className="w-3.5 h-3.5 text-cyber-cyan" /> PENGEMBANG / PERUSAHAAN
              </span>
              <p className="text-xs font-bold text-white leading-snug">
                {fundamentalMeta.developerOrg}
              </p>
            </div>

            <div className="bg-cyber-dark border border-gray-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase">
                <MapPin className="w-3.5 h-3.5 text-cyber-rose" /> LOKASI MARKAS UTAMA
              </span>
              <p className="text-xs font-bold text-white leading-snug">
                {fundamentalMeta.headquartersLocation}
              </p>
            </div>

            <div className="bg-cyber-dark border border-gray-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase">
                <Zap className="w-3.5 h-3.5 text-cyber-amber" /> UTILITY & FUNGSI TOKEN
              </span>
              <p className="text-xs font-bold text-white leading-snug">
                {fundamentalMeta.tokenUtility}
              </p>
            </div>

            <div className="bg-cyber-dark border border-gray-800 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-cyber-emerald" /> KONSENSUS & PROTOKOL
              </span>
              <p className="text-xs font-bold text-white leading-snug">
                {fundamentalMeta.consensusType}
              </p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider flex items-center gap-2 border-b border-gray-800/80 pb-3">
              <Compass className="w-4 h-4 text-cyber-cyan" /> CETAK BIRU & NARASI PROYEK
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-mono">
              {fundamentalMeta.indonesianDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cyber-dark border border-cyber-cyan/30 p-5 sm:p-6 rounded-2xl space-y-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-cyber-cyan" />
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-cyber-cyan" /> VISI & MISI UTAMA PROYEK
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed bg-cyber-bg/60 p-4 rounded-xl border border-gray-800">
                "{fundamentalMeta.visionMission}"
              </p>
            </div>

            <div className="bg-cyber-dark border border-cyber-neon/30 p-5 sm:p-6 rounded-2xl space-y-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-cyber-neon" />
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <Rocket className="w-4 h-4 text-cyber-neon" /> RENCANA MASA DEPAN & ROADMAP
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed bg-cyber-bg/60 p-4 rounded-xl border border-gray-800">
                "{fundamentalMeta.futureRoadmap}"
              </p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider flex items-center gap-2 border-b border-gray-800/80 pb-3">
              <Coins className="w-4 h-4 text-cyber-amber" /> PASOKAN TOKENOMICS (SUPPLY)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-cyber-bg p-3.5 rounded-xl border border-gray-800">
                <span className="text-gray-400 block text-[10px] mb-1">PASOKAN BEREDAR:</span>
                <span className="text-white font-black text-sm">
                  {circulating ? circulating.toLocaleString() : "Tidak terbatas"}
                </span>
              </div>

              <div className="bg-cyber-bg p-3.5 rounded-xl border border-gray-800">
                <span className="text-gray-400 block text-[10px] mb-1">PASOKAN MAKSIMUM:</span>
                <span className="text-cyber-cyan font-black text-sm">
                  {maxSupply ? maxSupply.toLocaleString() : "Tanpa Cap Maksimal"}
                </span>
              </div>

              <div className="bg-cyber-bg p-3.5 rounded-xl border border-gray-800">
                <span className="text-gray-400 block text-[10px] mb-1">MARKET CAP TOTAL:</span>
                <span className="text-cyber-emerald font-black text-sm">
                  ${coinData?.market_stats?.market_cap?.toLocaleString() || "0"}
                </span>
              </div>
            </div>

            {supplyRatio !== null && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>RASIO SIRKULASI PASOKAN</span>
                  <span className="text-cyber-cyan font-mono">{supplyRatio.toFixed(1)}% BEREDAR</span>
                </div>
                <div className="w-full h-2 bg-cyber-bg rounded-full border border-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon rounded-full"
                    style={{ width: `${supplyRatio}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            {coinData?.official_website && coinData.official_website !== "#" && (
              <a
                href={coinData.official_website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <Globe className="w-3.5 h-3.5" /> WEBSITE RESMI <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {coinData?.explorer_url && (
              <a
                href={coinData.explorer_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-cyber-neon/10 border border-cyber-neon/40 hover:bg-cyber-neon/20 text-cyber-neon rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <SearchIcon className="w-3.5 h-3.5" /> BLOCKCHAIN EXPLORER <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* KONTEN TAB 3: DEV KODE & BERITA LIVE */}
      {activeTab === "devnews" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-cyber-dark border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider flex items-center gap-2 border-b border-gray-800/80 pb-3">
              <Code2 className="w-4 h-4 text-cyber-cyan" /> REPOSITORI DEVELOPER CODE
            </h3>
            {typeof coinData?.developer_activity === "object" ? (
              <div className="space-y-3 text-xs bg-cyber-bg p-4 rounded-xl border border-gray-900 font-mono">
                <div className="flex justify-between border-b border-gray-800/60 pb-2">
                  <span className="text-gray-400">Commit Bulan Ini:</span>
                  <span className="text-cyber-cyan font-bold">
                    {coinData.developer_activity.total_commits_past_month} Commits
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 block text-[11px]">
                    Commit Terakhir:
                  </span>
                  <p className="text-white italic bg-cyber-dark p-3 rounded-xl border border-gray-800/60 max-h-24 overflow-y-auto break-words whitespace-pre-wrap font-mono text-[11px] custom-scrollbar">
                    "{coinData.developer_activity.latest_commit_message}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-xs p-6 text-center border border-dashed border-gray-800 rounded-xl">
                {coinData?.developer_activity || "Aktivitas pengodean repositori tidak tersedia."}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-cyber-dark border border-gray-800 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider flex items-center gap-2 border-b border-gray-800/80 pb-3">
              <Newspaper className="w-4 h-4 text-cyber-pink" /> LIVE AGGREGATED NEWS FEED
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {aiData?.news && aiData.news.length > 0 ? (
                aiData.news.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-cyber-bg p-3.5 rounded-xl border border-gray-900 hover:border-cyber-pink/40 transition-colors text-xs text-white hover:text-cyber-pink font-mono"
                  >
                    <span className="text-cyber-pink font-bold mr-2">[{idx + 1}]</span>
                    {item.title}
                  </a>
                ))
              ) : (
                <div className="text-gray-500 text-xs text-center py-10 border border-dashed border-gray-800 rounded-xl">
                  Aliran berita global koin ini sedang tidak tersedia atau terproteksi modul AI.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SearchIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
