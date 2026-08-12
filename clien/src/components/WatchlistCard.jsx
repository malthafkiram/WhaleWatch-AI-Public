import { useState } from "react";
import { motion } from "motion/react";
import { Trash2, Save, StickyNote } from "lucide-react";

export default function WatchlistCard({ item, onUpdateNotes, onDeleteItem }) {
  const [localNotes, setLocalNotes] = useState(item.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdateNotes(item.id, localNotes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: -30 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-cyber-dark border-2 border-gray-800/80 hover:border-cyber-cyan/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-4 relative group transition-colors"
    >
      {/* Bagian Atas: Identitas Koin */}
      <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-bg flex items-center justify-center border border-gray-800 font-mono font-bold text-cyber-cyan text-sm shadow-inner">
            {item.coinId?.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <h4 className="font-black text-white text-base tracking-wide uppercase">
              {item.coinId}
            </h4>
            <span className="text-xs text-gray-500 font-mono block">
              ID ENTITAS: {item.id}
            </span>
          </div>
        </div>

        {/* Tombol Aksi Hapus (DELETE) */}
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "#EF4444",
            color: "#0B0F19",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDeleteItem(item.id)}
          className="p-2.5 bg-cyber-rose/10 text-cyber-rose rounded-xl border border-cyber-rose/20 transition-all cursor-pointer"
          title="Hapus dari Watchlist"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Bagian Tengah: Input Form Catatan Target Harga */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5 text-cyber-pink" /> TULIS CATATAN
          ANDA
        </label>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          className="w-full h-20 bg-cyber-bg border border-gray-800 focus:border-cyber-cyan rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 outline-none transition-colors resize-none font-mono leading-relaxed"
        />
      </div>

      {/* Bagian Bawah: Tombol Simpan Perubahan (UPDATE) */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(6,182,212,0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-2.5 bg-cyber-cyan text-cyber-bg font-black text-xs rounded-xl tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        <Save className="w-3.5 h-3.5" /> {isSaving ? "SAVING DATA..." : "SAVE"}
      </motion.button>
    </motion.div>
  );
}
