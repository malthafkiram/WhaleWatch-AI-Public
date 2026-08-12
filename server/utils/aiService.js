const Groq = require("groq-sdk");

const PRIMARY_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    const err = new Error(
      "Layanan AI belum dikonfigurasi. Tambahkan GROQ_API_KEY di server.",
    );
    err.name = "aiConfigError";
    throw err;
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function isAiConfigured() {
  return Boolean(process.env.GROQ_API_KEY);
}

function extractJsonObject(text) {
  if (!text || typeof text !== "string") return {};

  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        // continue to brace extraction
      }
    }

    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return {};
      }
    }

    return {};
  }
}

function normalizeGroqError(error) {
  if (error?.name === "aiConfigError") return error;

  const status = error?.status;
  const code =
    error?.error?.code ||
    error?.error?.error?.code ||
    error?.error?.type;

  if (
    status === 401 ||
    error?.name === "AuthenticationError" ||
    code === "invalid_api_key"
  ) {
    const err = new Error("GROQ_API_KEY tidak valid atau kedaluwarsa.");
    err.name = "aiConfigError";
    return err;
  }

  if (status === 429 || error?.name === "RateLimitError") {
    const err = new Error(
      "Layanan AI sedang sibuk. Coba lagi dalam beberapa detik.",
    );
    err.name = "aiRateLimitError";
    return err;
  }

  if (
    error?.name === "APIConnectionError" ||
    error?.name === "APIConnectionTimeoutError" ||
    status === 503
  ) {
    const err = new Error(
      "Tidak dapat terhubung ke layanan AI. Coba lagi sebentar lagi.",
    );
    err.name = "aiServiceError";
    return err;
  }

  if (status === 404 || error?.name === "NotFoundError") {
    const err = new Error("Model AI tidak tersedia di server.");
    err.name = "aiServiceError";
    return err;
  }

  return error;
}

async function createChatCompletion(groq, options) {
  const models = [PRIMARY_MODEL];
  if (!models.includes(FALLBACK_MODEL)) {
    models.push(FALLBACK_MODEL);
  }

  let lastError;
  for (const model of models) {
    try {
      return await groq.chat.completions.create({
        ...options,
        model,
      });
    } catch (error) {
      lastError = error;
      const status = error?.status;
      const isModelIssue =
        status === 404 ||
        status === 400 ||
        error?.name === "NotFoundError" ||
        error?.name === "BadRequestError";

      if (!isModelIssue || model === models[models.length - 1]) {
        throw normalizeGroqError(error);
      }
    }
  }

  throw normalizeGroqError(lastError);
}

module.exports = {
  getGroqClient,
  isAiConfigured,
  extractJsonObject,
  normalizeGroqError,
  createChatCompletion,
  PRIMARY_MODEL,
};
