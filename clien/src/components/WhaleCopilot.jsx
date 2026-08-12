import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  Minimize2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../utils/api";

export default function WhaleCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Saya Whale Copilot, asisten AI khusus crypto milikmu. Apa yang ingin kamu analisis hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleSend = async (customMsg = null) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { id: Date.now(), sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customMsg) setInput("");
    setLoading(true);

    try {
      const historyToSend = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.post("/api/ai/chat", {
        message: textToSend,
        history: historyToSend,
      });

      const rawReply = res.data?.data?.reply || "Maaf, kendala jaringan.";
      const cleanReply =
        typeof rawReply === "string" ? rawReply.replace(/\*/g, "") : rawReply;

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: cleanReply },
      ]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? "Endpoint AI Chat belum ter-deploy di server target."
          : err.response?.status === 401
            ? "Sesi masuk telah berakhir. Silakan login kembali."
            : err.message || "Gagal menghubungkan ke AI Copilot.");

      const cleanError =
        typeof errorMsg === "string" ? errorMsg.replace(/\*/g, "") : errorMsg;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: `🚨 Error: ${cleanError}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "📈 Koin terbaik minggu ini?",
    "🛡️ Risk Assessment Bitcoin",
    "🎯 Strategi Entry Trading",
  ];

  return (
    <div className="fixed z-50 font-mono bottom-5 right-5 md:bottom-8 md:right-8 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup overlay chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm md:hidden z-40 cursor-default"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Whale Copilot chat"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-0 top-0 bottom-6 z-50 flex flex-col bg-cyber-dark rounded-b-2xl overflow-hidden md:static md:inset-auto md:bottom-auto md:mb-0 md:mr-0 md:w-[420px] md:h-[560px] md:max-h-[calc(100vh-7rem)] lg:max-h-[calc(100vh-8rem)] md:rounded-2xl md:border md:border-cyber-cyan/40 md:shadow-[0_0_30px_rgba(6,182,212,0.25)] md:bg-cyber-dark/95 md:backdrop-blur-xl"
            >
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-cyber-dark to-cyber-cyan/20 border-b border-cyber-cyan/30 flex items-center justify-between safe-pt">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-cyber-cyan/20 border border-cyber-cyan rounded-xl text-cyber-cyan animate-pulse flex-shrink-0">
                    <Bot className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      WHALE COPILOT AI{" "}
                      <Sparkles
                        className="w-3.5 h-3.5 text-cyber-neon"
                        aria-hidden="true"
                      />
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup chat"
                  className="p-2.5 min-h-11 min-w-11 text-gray-400 hover:text-white hover:bg-cyber-cyan/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                >
                  <X className="w-5 h-5 md:hidden" aria-hidden="true" />
                  <Minimize2
                    className="w-4 h-4 hidden md:block"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="p-2 bg-cyber-bg/60 border-b border-gray-800 flex gap-2 overflow-x-auto custom-scrollbar">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p)}
                    disabled={loading}
                    className="whitespace-nowrap min-h-10 px-3 py-2 text-xs bg-cyber-dark border border-gray-800 hover:border-cyber-cyan/50 text-gray-300 rounded-lg transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 custom-scrollbar text-sm md:text-xs leading-relaxed overscroll-contain">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                        m.sender === "user"
                          ? "bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan"
                          : "bg-cyber-neon/20 border border-cyber-neon text-cyber-neon"
                      }`}
                    >
                      {m.sender === "user" ? (
                        <User className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Bot className="w-4 h-4" aria-hidden="true" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] break-words ${
                        m.sender === "user"
                          ? "bg-cyber-cyan/10 border border-cyber-cyan/30 text-white rounded-tr-none"
                          : "bg-cyber-bg border border-gray-800 text-gray-200 rounded-tl-none whitespace-pre-line"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 items-center text-cyber-cyan text-xs italic py-2">
                    <RefreshCw
                      className="w-3.5 h-3.5 animate-spin"
                      aria-hidden="true"
                    />{" "}
                    Menulis analisis neural…
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="px-3 pt-3 pb-3 md:p-4 bg-cyber-dark border-t border-gray-800 flex items-center gap-2 shrink-0"
              >
                <label className="sr-only" htmlFor="copilot-input">
                  Pesan ke Whale Copilot
                </label>
                <input
                  id="copilot-input"
                  type="text"
                  name="copilot-message"
                  autoComplete="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya saran koin, analisis pasar…"
                  disabled={loading}
                  className="flex-1 min-h-11 bg-cyber-bg border border-gray-800 rounded-xl px-3 py-2.5 text-sm md:text-xs text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/60 focus:border-cyber-cyan/60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Kirim pesan"
                  className="p-2.5 min-h-11 min-w-11 bg-cyber-cyan hover:bg-cyan-400 text-cyber-dark font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
              <div className="h-5 shrink-0 bg-cyber-dark md:hidden" aria-hidden="true" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          aria-label="Buka Whale Copilot chat"
          className="min-h-12 px-4 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-neon text-cyber-dark font-black rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2 tracking-wider text-xs border border-white/20 cursor-pointer"
        >
          <Bot className="w-5 h-5 text-cyber-dark" aria-hidden="true" />
          <span>CHAT</span>
          <span
            className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"
            aria-hidden="true"
          />
        </motion.button>
      )}
    </div>
  );
}
