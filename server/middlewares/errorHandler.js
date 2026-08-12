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

  if (error.name === "aiConfigError") {
    message = error.message || "AI service is not configured";
    status = 503;
  }

  if (error.name === "coinDetailError") {
    message = error.message || "Gagal memuat detail koin";
    status = error.status || 503;
  }

  if (
    error.status === 401 &&
    (error.message?.includes("Invalid API Key") ||
      error.error?.error?.code === "invalid_api_key")
  ) {
    message = "GROQ_API_KEY tidak valid atau kedaluwarsa";
    status = 503;
  }

  res.status(status).json({
    message,
  });
}

module.exports = errorHandler;
