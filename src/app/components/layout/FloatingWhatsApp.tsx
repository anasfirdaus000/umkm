import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export function FloatingWhatsApp({ message = "Halo kak, saya ingin bertanya tentang produk MORVA MODE." }) {
  const { getWhatsAppUrl } = useSettings();
  const waLink = getWhatsAppUrl(message);

  return (
    <motion.a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center cursor-pointer group"
    >
      <MessageCircle size={32} />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-stone-800 text-sm font-medium py-2 px-4 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none border border-stone-100">
        Chat dengan Admin
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-stone-100"></div>
      </div>
      
      {/* Ping animation */}
      <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-30 animate-ping z-[-1]"></span>
    </motion.a>
  );
}
