import { API_URL } from "../../../config";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, MessageSquareText, Wrench } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

interface CustomService {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
}

export function CustomOrderSection() {
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppUrl } = useSettings();

  useEffect(() => {
    fetch(`${API_URL}/api/cms/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="custom" className="py-24 bg-stone-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[80%] rounded-full bg-[#b89341]/20 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Image Process / Services Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={loading || services.length === 0 ? "" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}
          >
            {loading ? (
              <div className="col-span-2 aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-2xl flex items-center justify-center bg-stone-100 border border-stone-200">
                <div className="w-12 h-12 border-4 border-[#b89341] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : services.length > 0 ? services.map((service, idx) => (
              <div key={service.id} className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-[#b89341]/10 flex items-center justify-center text-[#b89341] mb-4 overflow-hidden">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl.startsWith('http') ? service.imageUrl : `${API_URL}${service.imageUrl}`} 
                      alt={service.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Wrench size={20} />
                  )}
                </div>
                <h3 className="font-bold text-stone-800 mb-2">{service.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{service.description}</p>
              </div>
            )) : (
              <div className="col-span-2 aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1547609434-b732edfee020?q=80&w=1000&auto=format&fit=crop" 
                  alt="Custom Order Process" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#b89341]/10 text-[#b89341] font-medium text-sm mb-4">
              Layanan Spesial
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight mb-6">
              Wujudkan Desain <br />
              <span className="text-[#b89341]">Impian Anda</span>
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Tidak menemukan yang pas di katalog? Kami siap membantu mewujudkan produk dengan desain, ukuran, dan material sesuai keinginan Anda.
            </p>

            <ul className="space-y-4 mb-10">
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 text-stone-700 font-medium"
              >
                <CheckCircle2 className="text-green-500" size={24} />
                Bisa custom desain sendiri
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 text-stone-700 font-medium"
              >
                <CheckCircle2 className="text-green-500" size={24} />
                Konsultasi gratis dengan tim ahli
              </motion.li>
            </ul>

            <a
              href={getWhatsAppUrl("Halo kak, saya ingin custom order.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 hover:-translate-y-1"
            >
              <MessageSquareText size={20} />
              Chat Custom Sekarang
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
