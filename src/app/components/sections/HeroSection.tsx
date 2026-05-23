import { API_URL } from "../../../config";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const { getWhatsAppUrl } = useSettings();

  const defaultBackgrounds = [
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504280741564-f26b56615b80?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515250426548-26156e54564c?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80"
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);

    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products || data))
      .catch(console.error);
  }, []);

  const backgrounds = settings 
    ? [settings.heroBgUrl1, settings.heroBgUrl2, settings.heroBgUrl3, settings.heroBgUrl4]
        .filter(Boolean)
        .map(url => url.startsWith('http') ? url : `${API_URL}${url}`)
    : [];
    
  const activeBackgrounds = backgrounds.length > 0 ? backgrounds : defaultBackgrounds;

  const productUrl = settings?.heroProductUrl
    ? (settings.heroProductUrl.startsWith('http') ? settings.heroProductUrl : `${API_URL}${settings.heroProductUrl}`)
    : "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80";

  useEffect(() => {
    if (activeBackgrounds.length > 1) {
      const timer = setInterval(() => {
        setCurrentBg((prev) => (prev + 1) % activeBackgrounds.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeBackgrounds.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-stone-100">
      {/* Dynamic Backgrounds */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={activeBackgrounds[currentBg]}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay Gradients */}
      <div className="absolute inset-0 z-0 bg-stone-950/60"></div>
      
      {/* V2 3D Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      
      {/* Floating 3D Elements */}
      <motion.div 
        animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#b89341]/20 rounded-full blur-[80px] z-0"
      />
      <motion.div 
        animate={{ y: [0, 50, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-stone-500/20 rounded-full blur-[100px] z-0"
      />
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 left-1/4 w-48 h-48 bg-[#b89341]/20 rounded-full blur-[60px] z-0"
      />

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/60 backdrop-blur-md text-[#b89341] font-medium text-sm mb-6 border border-white/40 shadow-sm">
              Koleksi Premium Outdoor
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6"
          >
            Produk <span className="text-[#b89341]">Premium</span> <br />
            Berkualitas untuk Kebutuhan Anda
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-stone-200 mb-8 max-w-lg"
          >
            Melayani pembelian produk & custom order langsung via WhatsApp dengan desain elegan dan bahan terbaik.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#b89341] text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-[#b89341]/30 transition-all hover:-translate-y-1"
            >
              Konsultasi WhatsApp
              <ArrowRight size={18} />
            </a>
            <a
              href="/kategori"
              className="flex items-center gap-2 bg-white text-stone-800 px-8 py-4 rounded-full font-medium hover:bg-stone-50 border border-stone-200 transition-all hover:-translate-y-1 shadow-sm"
            >
              Lihat Produk
            </a>
          </motion.div>
        </div>

        {/* Right: Floating Product Showcase */}
        <div className="hidden lg:flex relative h-[600px] items-center justify-center perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotateY: -20, rotateX: 10, x: 50 }}
            animate={{ opacity: 1, rotateY: -10, rotateX: 5, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative w-full max-w-md aspect-[3/4] bg-white rounded-3xl p-4 shadow-2xl shadow-stone-900/10 transform-style-3d group hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out"
          >
            <a 
              href={products.find(p => p.name === settings?.heroProductTitle)?.id ? `/produk/${products.find(p => p.name === settings?.heroProductTitle)?.id}` : getWhatsAppUrl(`Halo kak, saya tertarik dengan ${settings?.heroProductTitle || 'Jas Hujan Premium'}`)}
              target={products.find(p => p.name === settings?.heroProductTitle) ? "_self" : "_blank"}
              rel="noreferrer"
              className="block w-full h-full rounded-2xl overflow-hidden relative cursor-pointer"
            >
              <img 
                src={productUrl} 
                alt="Featured Product" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-stone-800 mb-2 inline-block">BEST SELLER</span>
                <h3 className="text-white font-serif text-2xl mb-1">{settings?.heroProductTitle || "Jas Hujan Premium"}</h3>
                <p className="text-white/80 text-sm flex items-center justify-between">
                  <span>{settings?.heroProductDesc || "Warna Tersedia"}</span>
                  <span className="font-bold text-lg">{settings?.heroProductPrice || "Rp 250.000"}</span>
                </p>
              </div>
            </a>

            {/* Floating Badges V2 */}
            <motion.div 
              animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span className="font-bold text-lg">100+</span>
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Terjual</p>
                <p className="text-sm font-bold text-stone-800">Bulan Ini</p>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-12 bottom-32 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center gap-3"
            >
               <div className="w-10 h-10 rounded-full bg-[#b89341] flex items-center justify-center text-white">
                <ShoppingBag size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Pre-Order</p>
                <p className="text-xs text-stone-500 font-medium">Tersedia</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
