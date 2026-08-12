jest.mock("midtrans-client", () => {
  // Buat mock fungsi notification yang mengembalikan status settlement tiruan
  const mockNotification = jest.fn().mockResolvedValue({
    order_id: "WWA-1-171829381",
    transaction_status: "settlement",
    fraud_status: "accept",
  });

  const mockCreateTransaction = jest.fn().mockResolvedValue({
    token: "snap-token-xyz-123",
    redirect_url:
      "https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-xyz-123",
  });

  return {
    Snap: jest.fn().mockImplementation(() => {
      return {
        // Skema 1: Jika kontroler memanggil snap.transaction.notification
        transaction: {
          notification: mockNotification,
        },
        // Skema 2: Jika kontroler langsung memanggil snap.notification
        notification: mockNotification,
        // Untuk instance pembuatan token pembayaran
        createTransaction: mockCreateTransaction,
      };
    }),
  };
});

const request = require("supertest");
const app = require("../app");
const { sequelize, User, Watchlist } = require("../models");
const axios = require("axios");
const Groq = require("groq-sdk");
const Parser = require("rss-parser");
const midtransClient = require("midtrans-client");
const { OAuth2Client } = require("google-auth-library");

// ==========================================
// 1. MOCKING MODUL & API EKSTERNAL
// ==========================================
jest.mock("axios");
jest.mock("groq-sdk");
jest.mock("rss-parser");
jest.mock("midtrans-client");
jest.mock("google-auth-library");

let mockUserToken;
let mockPremiumUserToken;
let createdUserId;
let sampleWatchlistId;

beforeAll(async () => {
  // Sinkronisasi database testing bersih sebelum pengujian dimulai
  await sequelize.sync({ force: true });

  // 1. Buat user dummy reguler untuk testing authentikasi dan simpan tokennya
  const regularUser = await User.create({
    username: "riotester",
    email: "tester@whale.com",
    password: "password123", // Anggaplah terenkripsi otomatis di model hooks kamu
    avatar: "http://avatar.url",
    isPremium: false,
  });
  createdUserId = regularUser.id;

  // Lakukan request login langsung via supertest untuk mendapatkan token valid asli
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "tester@whale.com", password: "password123" });
  mockUserToken = loginRes.body.data?.access_token || loginRes.body.data;

  // 2. Buat user dummy premium
  const premiumUser = await User.create({
    username: "riopremium",
    email: "premium@whale.com",
    password: "password123",
    avatar: "http://avatar.url",
    isPremium: true,
  });

  const loginPremiumRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "premium@whale.com", password: "password123" });
  mockPremiumUserToken = loginPremiumRes.body.data?.access_token || loginPremiumRes.body.data;
});


afterAll(async () => {
  await sequelize.close();
});

describe("WhaleWatch AI Complete Integration Test Suite", () => {
  // ==========================================
  // A. TESTING AUTH CONTROLLER
  // ==========================================
  describe("Authentication API (/api/auth)", () => {
    it("POST /register - Sukses mendaftarkan user baru", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "newuser",
        email: "newuser@whale.com",
        password: "securepassword",
        avatar: "avatar",
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Created Successfuly"); // Mengikuti typo 'Successfuly' pada kode asli[cite: 21]
    });

    it("POST /register - Gagal karena Sequelize Validation Error (Validasi Model)", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "invalid-email-format" }); // Memicu error validasi database
      expect(res.status).toBe(400);
    });

    it("POST /login - Sukses masuk & mengembalikan token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "tester@whale.com", password: "password123" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "login successfuly");
      expect(res.body).toHaveProperty("data");
    });

    it("POST /login - Gagal karena email/password kosong (loginError)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Your email or password is incorrect"); // Sesuai errorHandler[cite: 25]
    });

    it("POST /google-login - Gagal karena header token kosong (invalidToken)", async () => {
      const res = await request(app).post("/api/auth/google-login");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Please login first");
    });
  });

  // ==========================================
  // B. TESTING COIN CONTROLLER
  // ==========================================
  describe("Coins API (/api/coins)", () => {
    it("GET /markets - Sukses mengambil data market terstruktur", async () => {
      // Pasang mock axios khusus untuk test ini
      axios.get.mockResolvedValueOnce({
        data: [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            image: "img",
            current_price: 60000,
            market_cap: 1000000,
            price_change_percentage_24h: 2.5,
          },
        ],
      });

      const res = await request(app)
        .get("/api/coins/markets")
        .query({ category: "layer1" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Fetch market data successfully");
      expect(res.body.data[0].category).toBe("Layer 1"); // Validasi pemetaan kategori[cite: 22]
    });

    it("GET /detail/:id - Sukses mengambil detail koin beserta mock data Github", async () => {
      axios.get
        .mockResolvedValueOnce({
          data: {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            links: {
              repos_url: { github: ["https://github.com/bitcoin/bitcoin"] },
              homepage: ["https://bitcoin.org"],
            },
            market_data: { current_price: { usd: 60000 } },
          },
        }) // Mock data CoinGecko[cite: 22]
        .mockResolvedValueOnce({
          data: [
            {
              commit: { message: "Fix core block" },
              author: { date: "2026-01-01" },
            },
          ],
        }); // Mock data GitHub Commit[cite: 22]

      const res = await request(app).get("/api/coins/detail/bitcoin");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Fetch coin detail successfully");
      expect(res.body.data.developer_activity).toHaveProperty(
        "total_commits_past_month",
      );
    });
  });

  // ==========================================
  // C. TESTING WATCHLIST CONTROLLER
  // ==========================================
  describe("Watchlist API (/api/watchlist)", () => {
    it("POST / - Gagal menambahkan ke watchlist jika tidak terautentikasi", async () => {
      const res = await request(app)
        .post("/api/watchlist")
        .send({ coinId: "bitcoin" });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Please login first"); // Sesuai penanganan auth middleware / errorHandler[cite: 25]
    });

    it("POST / - Gagal jika properti coinId kosong (notcoin)", async () => {
      const res = await request(app)
        .post("/api/watchlist")
        .set("Authorization", `Bearer ${mockUserToken}`)
        .send({ coinId: "" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Coin ID wajib dikirimkan"); // Memicu properti error 'notcoin'[cite: 25]
    });

    it("POST / - Sukses menambahkan koin baru ke daftar pantauan", async () => {
      const res = await request(app)
        .post("/api/watchlist")
        .set("Authorization", `Bearer ${mockUserToken}`)
        .send({ coinId: "ethereum" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Berhasil menambahkan koin ke watchlist");
      sampleWatchlistId = res.body.data.id; // Ambil ID untuk tes hapus nanti
    });

    it("POST / - Gagal jika menambahkan koin yang sama (existingWatchlist)", async () => {
      const res = await request(app)
        .post("/api/watchlist")
        .set("Authorization", `Bearer ${mockUserToken}`)
        .send({ coinId: "ethereum" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Koin ini sudah ada di dalam watchlist kamu",
      ); // Sesuai errorHandler[cite: 25]
    });

    it("GET / - Sukses memuat daftar koin milik user", async () => {
      const res = await request(app)
        .get("/api/watchlist")
        .set("Authorization", `Bearer ${mockUserToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("DELETE /:id - Gagal jika menghapus data watchlist milik orang lain (notYours)", async () => {
      // Hapus menggunakan token user Premium untuk menghapus watchlist milik user Reguler
      const res = await request(app)
        .delete(`/api/watchlist/${sampleWatchlistId}`)
        .set("Authorization", `Bearer ${mockPremiumUserToken}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "Kamu tidak memiliki akses untuk menghapus data ini",
      ); // Sesuai errorHandler[cite: 25]
    });

    it("DELETE /:id - Sukses menghapus koin dari watchlist milik sendiri", async () => {
      const res = await request(app)
        .delete(`/api/watchlist/${sampleWatchlistId}`)
        .set("Authorization", `Bearer ${mockUserToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("berhasil dihapus dari watchlist");
    });

    it("DELETE /:id - Gagal jika data memang tidak ditemukan (notFoundWhatclist)", async () => {
      const res = await request(app)
        .delete("/api/watchlist/9999")
        .set("Authorization", `Bearer ${mockUserToken}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Data watchlist tidak ditemukan"); // Sesuai errorHandler[cite: 25]
    });
  });

  // ==========================================
  // D. TESTING AI CONTROLLER
  // ==========================================
  describe("AI Analysis API (/api/ai)", () => {
    it("GET /analyze/:id - Sukses menghasilkan analisis Llama 3.1 & RSS News", async () => {
      // Mock Axios CoinGecko
      axios.get.mockResolvedValueOnce({
        data: {
          name: "Bitcoin",
          symbol: "btc",
          market_data: { current_price: { usd: 60000 } },
        },
      });
      // Mock RSS Feed Parser[cite: 20]
      Parser.prototype.parseURL.mockResolvedValueOnce({
        items: [
          {
            title: "Bitcoin Skyrockets!",
            link: "https://news.com",
            contentSnippet: "Bitcoin surges",
          },
        ],
      });
      // Mock Groq SDK Completion[cite: 20]
      Groq.prototype.chat = {
        completions: {
          create: jest.fn().mockResolvedValueOnce({
            choices: [
              {
                message: {
                  content:
                    '{"recommendation":"BUY","sentiment":"Bullish","analysis":"Good trend"}',
                },
              },
            ],
          }),
        },
      };

      const res = await request(app)
        .get("/api/ai/analyze/bitcoin")
        .set("Authorization", `Bearer ${mockUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        "AI analysis and news fetched successfully using Groq",
      );
      expect(res.body.data.ai_analysis).toHaveProperty("recommendation", "BUY");
    });

    it("POST /chat - Sukses merespons obrolan AI Copilot", async () => {
      Groq.prototype.chat = {
        completions: {
          create: jest.fn().mockResolvedValueOnce({
            choices: [
              {
                message: {
                  content: "Halo, saya Whale Copilot!",
                },
              },
            ],
          }),
        },
      };

      const res = await request(app)
        .post("/api/ai/chat")
        .set("Authorization", `Bearer ${mockUserToken}`)
        .send({ message: "Halo AI" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Copilot response generated");
      expect(res.body.data).toHaveProperty("reply", "Halo, saya Whale Copilot!");
    });
  });


  // ==========================================
  // E. TESTING PAYMENT CONTROLLER
  // ==========================================
  describe("Payment API (/api/payment)", () => {
    it("POST /initiate - Sukses membuat sesi transaksi Midtrans Snap token", async () => {
      // Mock Midtrans Snap SDK[cite: 23]
      midtransClient.Snap.prototype.createTransaction = jest
        .fn()
        .mockResolvedValueOnce({
          token: "snap-token-xyz-123",
          redirect_url: "https://checkout.midtrans.com/xyz",
        });

      const res = await request(app)
        .post("/api/payment/initiate")
        .set("Authorization", `Bearer ${mockUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token", "snap-token-xyz-123");
      expect(res.body.message).toBe("Sesi pembayaran berhasil dibuat");
    });

    it("POST /initiate - Gagal inisialisasi jika user sudah berstatus Premium", async () => {
      const res = await request(app)
        .post("/api/payment/initiate")
        .set("Authorization", `Bearer ${mockPremiumUserToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Akun kamu sudah berstatus Premium"); // Blokir pembayaran ganda[cite: 23]
    });

    it("POST /notification - Langsung sukses bypass jika menerima request ping dummy dari Midtrans", async () => {
      const res = await request(app).post("/api/payment/notification").send({
        order_id: "payment_test_ping_12345",
        transaction_status: "settlement",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Test connection successful"); // Proteksi bypass ping[cite: 23]
    });

    it("POST /notification - Memproses mutasi dengan validasi SDK jika order_id asli (WWA-)", async () => {
      // Mock fungsi verifikasi notifikasi resmi milik Midtrans
      midtransClient.Snap.prototype.transaction = {
        notification: jest.fn().mockResolvedValueOnce({
          order_id: `WWA-${createdUserId}-171829381`,
          transaction_status: "settlement",
          fraud_status: "accept",
        }),
      };

      const res = await request(app)
        .post("/api/payment/notification")
        .send({ order_id: `WWA-${createdUserId}-171829381` });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("OK");

      // Cek apakah di database user sudah otomatis naik status menjadi premium
      const updatedUser = await User.findByPk(createdUserId);
      expect(String(updatedUser.isPremium)).toBe("true"); // Naik level otomatis sukses[cite: 23]
    });
  });
});
