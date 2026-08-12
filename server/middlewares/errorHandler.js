function errorHandler(error, req, res, next) {
  console.log(error);
  console.log(error.errors);
  let message = "Internal Server Error";
  let status = 500;

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    message = error.errors.map((el) => el.message).join(", ");
    status = 400;
  }

  if (error.name === "loginError") {
    message = "Your email or password is incorrect";
    status = 400;
  }

  if (error.name === "invalidToken") {
    message = "Invalid signature";
    status = 401;
  }

  if (error.name === "loginGoogleError") {
    message = "email is not verified";
    status = 401;
  }

  if (error.name === "unauthenticated" || error.name === "JsonWebTokenError") {
    message = "Please login first";
    status = 401;
  }

  if (error.name === "notcoin") {
    message = "Coin ID wajib dikirimkan";
    status = 400;
  }

  if (error.name === "existingWatchlist") {
    message = "Koin ini sudah ada di dalam watchlist kamu";
    status = 400;
  }

  if (error.name === "notFoundWhatclist") {
    message = "Data watchlist tidak ditemukan";
    status = 404;
  }

  if (error.name === "notYours") {
    message = "Kamu tidak memiliki akses untuk menghapus data ini";
    status = 403;
  }

  if (
    error.name === "SequelizeConnectionError" ||
    error.name === "SequelizeConnectionRefusedError" ||
    error.name === "SequelizeHostNotFoundError" ||
    error.name === "SequelizeHostNotReachableError" ||
    error.name === "SequelizeAccessDeniedError" ||
    error.name === "SequelizeInvalidConnectionError" ||
    error.name === "SequelizeDatabaseError"
  ) {
    const missingTable =
      error.original?.code === "42P01" ||
      String(error.message || "").includes("does not exist");

    message = missingTable
      ? "Database tables belum tersedia. Jalankan migrasi di server."
      : "Database connection failed. Check DATABASE_URL and NODE_ENV on the server.";
    status = 503;
  }

  if (error.name === "authConfigError") {
    message = error.message || "Konfigurasi autentikasi belum lengkap.";
    status = 503;
  }

  if (error.name === "googleConfigError") {
    message =
      error.message ||
      "GOOGLE_CLIENT_ID belum dikonfigurasi. Harus sama dengan clientId di frontend.";
    status = 503;
  }

  if (error.name === "aiConfigError") {
    message = error.message || "AI service is not configured";
    status = 503;
  }

  if (error.name === "aiRateLimitError") {
    message = error.message || "Layanan AI sedang sibuk. Coba lagi sebentar lagi.";
    status = 503;
  }

  if (error.name === "aiServiceError") {
    message = error.message || "Layanan AI sementara tidak tersedia.";
    status = 503;
  }

  if (error.name === "SyntaxError") {
    message = "Gagal memproses respons AI. Coba lagi.";
    status = 502;
  }

  if (
    error.name === "AuthenticationError" ||
    error.error?.code === "invalid_api_key" ||
    error.error?.error?.code === "invalid_api_key" ||
    (error.status === 401 &&
      String(error.message || "").toLowerCase().includes("api key"))
  ) {
    message = "GROQ_API_KEY tidak valid atau kedaluwarsa";
    status = 503;
  }

  if (error.status === 429 || error.name === "RateLimitError") {
    message = "Layanan AI sedang sibuk. Coba lagi dalam beberapa detik.";
    status = 503;
  }

  if (
    error.name === "APIConnectionError" ||
    error.name === "APIConnectionTimeoutError"
  ) {
    message = "Tidak dapat terhubung ke layanan AI. Coba lagi sebentar lagi.";
    status = 503;
  }

  if (error.name === "coinDetailError") {
    message = error.message || "Gagal memuat detail koin";
    status = error.status || 503;
  }

  res.status(status).json({
    message,
  });
}

module.exports = errorHandler;
