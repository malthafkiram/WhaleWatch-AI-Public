const axios = require("axios");

// Simple in-memory cache store
const cacheStore = new Map();
const CACHE_TTL = 45 * 1000; // 45 seconds TTL to avoid CoinGecko rate limits

const getFromCache = (key) => {
  const cached = cacheStore.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setInCache = (key, data) => {
  cacheStore.set(key, { data, timestamp: Date.now() });
};

class CoinController {
  static async getMarketData(req, res, next) {
    try {
      const { category } = req.query;
      const cacheKey = `markets_${category || "all"}`;
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        return res.status(200).json({
          message: "Fetch market data successfully (cached)",
          data: cachedData,
        });
      }

      const BASE_URL = "https://api.coingecko.com/api/v3/coins/markets";
      const config = {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 30,
          page: 1,
          sparkline: false,
        },
      };

      if (category === "layer1") {
        config.params.ids =
          "bitcoin,ethereum,binancecoin,solana,ripple,cardano,avalanche-2,the-open-network,sui,chainlink,polkadot,near,aptos,internet-computer,kaspa";
      } else if (category === "layer2") {
        config.params.ids =
          "arbitrum,optimism,polygon-ecosystem-token,starknet,mantle,immutable-x,dymension,zksync";
      } else if (category === "meme") {
        config.params.ids = "dogecoin,shiba-inu,pepe,dogwifcoin,floki,bonk,popcat";
      } else if (category === "ai") {
        config.params.ids = "bittensor,render-token,fetch-ai,injective-protocol,the-graph,singularitynet";
      } else {
        config.params.ids =
          "bitcoin,ethereum,tether,binancecoin,solana,ripple,usd-coin,cardano,dogecoin,avalanche-2,shiba-inu,the-open-network,sui,chainlink,polkadot,near,pepe,aptos,uniswap,bittensor,internet-computer,arbitrum,polygon-ecosystem-token,optimism,render-token,fetch-ai,dogwifcoin,immutable-x,injective-protocol,kaspa";
      }

      const response = await axios.get(BASE_URL, config);

      const mappedData = response.data.map((coin) => {
        let coinCategory = "Other";

        if (
          [
            "bitcoin",
            "ethereum",
            "binancecoin",
            "solana",
            "ripple",
            "cardano",
            "avalanche-2",
            "the-open-network",
            "sui",
            "chainlink",
            "polkadot",
            "near",
            "aptos",
            "internet-computer",
            "kaspa",
          ].includes(coin.id)
        ) {
          coinCategory = "Layer 1";
        } else if (
          [
            "arbitrum",
            "optimism",
            "polygon-ecosystem-token",
            "starknet",
            "mantle",
            "immutable-x",
            "dymension",
            "zksync",
          ].includes(coin.id)
        ) {
          coinCategory = "Layer 2";
        } else if (
          ["dogecoin", "shiba-inu", "pepe", "dogwifcoin", "floki", "bonk", "popcat"].includes(coin.id)
        ) {
          coinCategory = "Meme Coins";
        } else if (
          ["bittensor", "render-token", "fetch-ai", "injective-protocol", "the-graph", "singularitynet"].includes(coin.id)
        ) {
          coinCategory = "AI";
        }

        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          category: coinCategory,
        };
      });


      setInCache(cacheKey, mappedData);

      res.status(200).json({
        message: "Fetch market data successfully",
        data: mappedData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoinDetail(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `detail_${id}`;
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        return res.status(200).json({
          message: "Fetch coin detail successfully (cached)",
          data: cachedData,
        });
      }

      const BASE_URL = `https://api.coingecko.com/api/v3/coins/${id}`;

      const config = {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: true,
          sparkline: false,
        },
        timeout: 15000,
      };

      let coinResponse;
      try {
        coinResponse = await axios.get(BASE_URL, config);
      } catch (cgError) {
        const err = new Error(
          cgError.code === "ECONNABORTED" || cgError.code === "ETIMEDOUT"
            ? "CoinGecko timeout — coba lagi sebentar."
            : cgError.response?.status === 404
              ? "Coin ID tidak ditemukan di CoinGecko."
              : "Gagal mengambil data detail koin dari CoinGecko.",
        );
        err.name = "coinDetailError";
        err.status = cgError.response?.status === 404 ? 404 : 503;
        throw err;
      }

      const coinData = coinResponse.data;

      const githubRepoUrl = coinData.links?.repos_url?.github?.[0];
      let githubCommits = "No GitHub repository found";

      if (githubRepoUrl && githubRepoUrl.includes("github.com")) {
        try {
          const repoPath = githubRepoUrl
            .replace("https://github.com/", "")
            .replace(/\/$/, "");

          const GITHUB_API_URL = `https://api.github.com/repos/${repoPath}/commits`;

          const githubResponse = await axios.get(GITHUB_API_URL, {
            headers: {
              "User-Agent": "WhaleWatch-AI-App",
            },
            params: {
              per_page: 30,
              since: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
            timeout: 10000,
          });

          githubCommits = {
            total_commits_past_month: githubResponse.data.length,
            latest_commit_message:
              githubResponse.data[0]?.commit?.message || "No commit message",
            latest_commit_date:
              githubResponse.data[0]?.commit?.author?.date || null,
          };
        } catch (gitError) {
          githubCommits = "GitHub activity temporarily unavailable";
        }
      }

      const finalDetailData = {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol.toUpperCase(),
        image: coinData.image?.large,
        description: coinData.description?.en || "No description available.",
        official_website: coinData.links?.homepage?.[0] || "#",
        explorer_url: coinData.links?.blockchain_site?.[0] || null,
        categories: coinData.categories || [],
        genesis_date: coinData.genesis_date || null,
        supply: {
          circulating_supply: coinData.market_data?.circulating_supply || null,
          total_supply: coinData.market_data?.total_supply || null,
          max_supply: coinData.market_data?.max_supply || null,
        },
        market_stats: {
          current_price: coinData.market_data?.current_price?.usd,
          market_cap: coinData.market_data?.market_cap?.usd,
          total_volume: coinData.market_data?.total_volume?.usd,
          price_change_percentage_24h:
            coinData.market_data?.price_change_percentage_24h,
          high_24h: coinData.market_data?.high_24h?.usd,
          low_24h: coinData.market_data?.low_24h?.usd,
        },
        developer_activity: githubCommits,
      };

      setInCache(cacheKey, finalDetailData);

      res.status(200).json({
        message: "Fetch coin detail successfully",
        data: finalDetailData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoinChart(req, res, next) {
    try {
      const { id } = req.params;
      const requestedDays = String(req.query.days || "7");
      const cacheKey = `chart_${id}_${requestedDays}`;
      const cachedChart = getFromCache(cacheKey);
      if (cachedChart) {
        return res.status(200).json({
          message: "Fetch chart data successfully (cached)",
          data: cachedChart,
        });
      }

      const cgDays = requestedDays === "0.5" ? "1" : requestedDays;
      const BASE_URL = `https://api.coingecko.com/api/v3/coins/${id}/market_chart`;
      const config = {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          vs_currency: "usd",
          days: cgDays,
        },
      };

      const chartResponse = await axios.get(BASE_URL, config);
      let rawPrices = chartResponse.data?.prices || [];

      if (requestedDays === "0.5") {
        const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;
        rawPrices = rawPrices.filter((item) => item[0] >= twelveHoursAgo);
      }

      // Helper pemformat presisi harga grafik
      const formatChartPrice = (val) => {
        if (typeof val !== "number" || isNaN(val)) return 0;
        if (Math.abs(val) >= 1) return parseFloat(val.toFixed(2));
        if (Math.abs(val) >= 0.0001) return parseFloat(val.toFixed(6));
        return parseFloat(val.toFixed(8));
      };

      // Format for recharts ({ day: string, Price: number })
      const formattedChart = rawPrices.map((item) => {
        const date = new Date(item[0]);
        let timeLabel = "";

        if (requestedDays === "0.5" || requestedDays === "1") {
          timeLabel = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (requestedDays === "2" || requestedDays === "3") {
          timeLabel = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        } else {
          timeLabel = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
        }

        return {
          timestamp: item[0],
          day: timeLabel,
          Price: formatChartPrice(item[1]),
        };
      });

      setInCache(cacheKey, formattedChart);

      res.status(200).json({
        message: "Fetch coin chart successfully",
        data: formattedChart,
      });
    } catch (error) {

      // Fallback generator if coingecko market_chart hits rate limit
      const fallbackPrice = 100;
      const fallbackData = Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        Price: parseFloat((fallbackPrice * (1 + (Math.sin(i) * 0.05))).toFixed(2)),
      }));
      res.status(200).json({
        message: "Fetch coin chart fallback",
        data: fallbackData,
      });
    }

  }
}

module.exports = CoinController;

