import { motion } from "motion/react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export function CTASection() {
  const { getWhatsAppUrl } = useSettings();
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-stone-900 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[80%] h-[80%] bg-[#b89341]/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-[#d4b46a]/40 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 p-12 md:p-20 rounded-[3rem] shadow-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Siap Memesan Produk atau <br /> Custom Design?
          </h2>
          <p className="text-stone-300 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Wujudkan ruangan impian Anda dengan produk premium berkualitas dari kami. Konsultasi gratis sekarang!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={getWhatsAppUrl("Halo kak, saya ingin konsultasi produk.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-full font-medium hover:bg-stone-100 transition-all hover:scale-105 shadow-xl shadow-white/10"
            >
              Hubungi via WhatsApp
              <ArrowRight size={18} />
            </a>
            <a
              href="#produk"
              className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all"
            >
              <ShoppingCart size={18} />
              Lihat Katalog
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
