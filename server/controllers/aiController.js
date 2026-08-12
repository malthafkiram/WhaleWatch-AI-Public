const Parser = require("rss-parser");
const axios = require("axios");
const {
  getGroqClient,
  extractJsonObject,
  createChatCompletion,
} = require("../utils/aiService");

let parser = new Parser();

class AiController {
  static async analyzeCoin(req, res, next) {
    try {
      const { id } = req.params;
      const userStatus = req.user;
      const groq = getGroqClient();

      let coinData = {
        name: id,
        symbol: String(id).slice(0, 8),
        market_data: { current_price: { usd: null }, price_change_percentage_24h: 0 },
      };

      try {
        const BASE_URL = `https://api.coingecko.com/api/v3/coins/${id}`;
        const config = {
          headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
          params: {
            localization: false,
            tickers: false,
            community_data: false,
            developer_data: false,
          },
          timeout: 15000,
        };
        const coinResponse = await axios.get(BASE_URL, config);
        coinData = coinResponse.data;
      } catch (coinError) {
        console.error(
          "CoinGecko unavailable for analyze:",
          coinError.message || coinError.code,
        );
      }

      const price = coinData.market_data?.current_price?.usd;
      const change24h = coinData.market_data?.price_change_percentage_24h || 0;

      let finalNews = [];
      try {
        const feed = await parser.parseURL("https://cointelegraph.com/rss");
        const items = feed.items || [];

        const relevantNews = items
          .filter(
            (item) =>
              item.title.toLowerCase().includes(coinData.name.toLowerCase()) ||
              item.contentSnippet
                ?.toLowerCase()
                .includes(coinData.name.toLowerCase()),
          )
          .slice(0, 5)
          .map((item) => ({ title: item.title, link: item.link }));

        finalNews =
          relevantNews.length > 0
            ? relevantNews
            : items
                .slice(0, 5)
                .map((item) => ({ title: item.title, link: item.link }));
      } catch (rssError) {
        console.error("RSS feed unavailable:", rssError.message);
        finalNews = [];
      }

      let promptInstruction = `
        Kamu adalah sistem analis AI profesional khusus cryptocurrency untuk platform WhaleWatch AI.
        Analisis koin ${coinData.name} (${coinData.symbol.toUpperCase()}) dengan harga saat ini $${price} (Perubahan 24j: ${change24h}%).
        
        Berikut adalah berita pasar terbaru sebagai bahan pertimbangan analisis sentimen:
        ${JSON.stringify(finalNews.map((n) => n.title))}

        Berikan respon dalam format JSON objek mentah dengan struktur wajib seperti di bawah ini dan gunakan Bahasa Indonesia yang profesional:
        {
          "recommendation": "BUY" atau "HOLD" atau "SELL",
          "sentiment": "Bullish" atau "Bearish" atau "Neutral",
          "analysis": "Berikan ringkasan analisis singkat maksimal 2 kalimat berdasarkan data harga dan berita di atas."
        }
      `;

      if (userStatus && String(userStatus.isPremium) === "true") {
        promptInstruction += ` Tambahkan properti JSON baru yaitu "premium_deep_dive": "berikan analisis psikologis pasar secara mendalam dan strategi entri rahasia berdasarkan berita di atas minimal 3 kalimat."`;
      }

      const chatCompletion = await createChatCompletion(groq, {
        messages: [
          {
            role: "user",
            content: promptInstruction,
          },
        ],
        response_format: { type: "json_object" },
      });

      const aiResultJson = extractJsonObject(
        chatCompletion.choices[0]?.message?.content,
      );

      if (!aiResultJson.recommendation) {
        aiResultJson.recommendation = "HOLD";
        aiResultJson.sentiment = aiResultJson.sentiment || "Neutral";
        aiResultJson.analysis =
          aiResultJson.analysis ||
          "Analisis AI sementara tidak tersedia. Data harga dan berita tetap dapat dilihat di atas.";
      }

      res.status(200).json({
        message: "AI analysis and news fetched successfully using Groq",
        data: {
          news: finalNews,
          ai_analysis: aiResultJson,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async chatWithCopilot(req, res, next) {
    try {
      const { message, history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Pesan tidak boleh kosong." });
      }

      const groq = getGroqClient();

      const systemPrompt = `
        Kamu adalah "Whale Copilot", asisten AI cerdas dan profesional untuk platform WhaleWatch AI.
        Tugasmu adalah menjawab pertanyaan pengguna seputar pasar cryptocurrency, strategi trading, analisis teknikal & fundamental, serta saran keamanan investasi.
        Gunakan Bahasa Indonesia yang ramah, profesional, serta menyertakan emoji cyber/crypto bila relevan.
        Jawablah dengan ringkas, tajam, dan langsung ke poin utama (maksimal 3-4 paragraf).
      `;

      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.sender === "user" ? "user" : "assistant",
          content: h.text,
        })),
        { role: "user", content: message },
      ];

      const completion = await createChatCompletion(groq, {
        messages: formattedMessages,
      });

      const reply =
        completion.choices[0]?.message?.content ||
        "Maaf, AI Copilot sedang mengalami kendala teknis.";

      res.status(200).json({
        message: "Copilot response generated",
        data: { reply },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWhaleAlerts(req, res, next) {
    try {
      const sampleAlerts = [
        {
          id: "w-101",
          txHash: "0x89a...4f2b",
          coin: "BTC",
          amount: "1,450 BTC ($94,250,000)",
          from: "Unknown Wallet (Whale)",
          to: "Binance Exchange",
          type: "EXCHANGE_DEPOSIT",
          riskLevel: "HIGH_DUMP_RISK",
          aiSignal:
            "Potensi tekanan jual (Sell-Off) akibat perpindahan BTC raksasa ke bursa bursa utama.",
          timeAgo: "2 mnt yang lalu",
        },
        {
          id: "w-102",
          txHash: "0x12c...9e8a",
          coin: "ETH",
          amount: "24,000 ETH ($81,600,000)",
          from: "Coinbase Prime",
          to: "Cold Storage (Gnosis Safe)",
          type: "COLD_STORAGE_WITHDRAWAL",
          riskLevel: "BULLISH_ACCUMULATION",
          aiSignal:
            "Sinyal akumulasi jangka panjang (Holding) oleh institusi raksasa.",
          timeAgo: "7 mnt yang lalu",
        },
        {
          id: "w-103",
          txHash: "0x77f...3d11",
          coin: "SOL",
          amount: "350,000 SOL ($52,500,000)",
          from: "Kraken Exchange",
          to: "Unknown Wallet",
          type: "EXCHANGE_WITHDRAWAL",
          riskLevel: "BULLISH_ACCUMULATION",
          aiSignal:
            "Penarikan besar-besaran mengindikasikan berkurangnya pasokan SOL di pasar spot.",
          timeAgo: "15 mnt yang lalu",
        },
        {
          id: "w-104",
          txHash: "0x44b...1a09",
          coin: "PEPE",
          amount: "4,500,000,000,000 PEPE ($40,500,000)",
          from: "Binance Exchange",
          to: "MEXC Exchange",
          type: "INTER_EXCHANGE_TRANSFER",
          riskLevel: "NEUTRAL_ARBITRAGE",
          aiSignal:
            "Aktivitas arbitrase antar bursa oleh akun pembuat pasar (Market Maker).",
          timeAgo: "28 mnt yang lalu",
        },
      ];

      res.status(200).json({
        message: "Whale alerts fetched successfully",
        data: sampleAlerts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async auditPortfolio(req, res, next) {
    try {
      const { coins } = req.body;
      if (!coins || !Array.isArray(coins) || coins.length === 0) {
        return res
          .status(400)
          .json({ message: "Daftar koin tidak boleh kosong." });
      }

      const groq = getGroqClient();

      const prompt = `
        Kamu adalah Senior Risk Officer dan AI Portfolio Analyst untuk WhaleWatch AI.
        Analisis daftar koin kripto di bawah ini yang dipantau pengguna:
        ${JSON.stringify(coins)}

        Berikan keluaran dalam format JSON mentah dengan struktur:
        {
          "riskScore": angka 1 sampai 100 (100 = Sangat Berisiko/Spekulatif),
          "riskCategory": "Rendah" atau "Sedang" meupun "Tinggi / Spekulatif",
          "summary": "Analisis singkat diversifikasi portofolio maksimal 3 kalimat.",
          "recommendations": [
            "Saran 1 untuk optimasi portofolio",
            "Saran 2 untuk optimasi portofolio"
          ]
        }
      `;

      const completion = await createChatCompletion(groq, {
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const auditResult = extractJsonObject(
        completion.choices[0]?.message?.content,
      );

      if (!auditResult.riskScore) {
        auditResult.riskScore = 50;
        auditResult.riskCategory = auditResult.riskCategory || "Sedang";
        auditResult.summary =
          auditResult.summary ||
          "Audit AI sementara tidak dapat menghasilkan ringkasan lengkap.";
        auditResult.recommendations = auditResult.recommendations || [
          "Pantau kembali portofolio setelah beberapa saat.",
        ];
      }

      res.status(200).json({
        message: "Portfolio audit completed",
        data: auditResult,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AiController;
