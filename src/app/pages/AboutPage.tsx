import { motion } from "motion/react";
import { CheckCircle2, Target, Eye, ShieldCheck, MapPin, Phone } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { getImageUrl } from "../../config";

export function AboutPage() {
  const { getWhatsAppUrl, settings } = useSettings();
  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[#b89341] font-medium tracking-wider text-sm uppercase mb-3 block">
            {settings.aboutSubtitle || "Tentang Perusahaan"}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight max-w-2xl whitespace-pre-line">
            {settings.aboutTitle || "Mengenal Lebih Dekat\nMORVA MODE INDONESIA"}
          </h1>
        </div>

        {/* Hero Image & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src={getImageUrl(settings.aboutImageUrl) || "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop"} 
                alt="Tentang Morva Mode" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/10"></div>
            </div>
            {/* Logo Badge Overlay */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white rounded-3xl shadow-xl border border-stone-100 p-6 flex items-center justify-center hidden md:flex">
              <img src={getImageUrl(settings?.logoUrl) || "/logo.jpeg"} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">{settings.aboutIntroTitle || "Penyedia Perlengkapan Outdoor Berkualitas Premium"}</h2>
            <div className="text-stone-600 leading-relaxed mb-8 whitespace-pre-line">
              {settings.aboutDescription || "MORVA MODE INDONESIA hadir sebagai solusi perlengkapan outdoor dan perlindungan harian Anda."}
            </div>
            <div className="flex items-center gap-4 border-t border-stone-200 pt-8 mt-4">
              <div className="w-14 h-14 rounded-full bg-[#b89341]/10 flex items-center justify-center text-[#b89341]">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">{settings.aboutGuaranteeTitle || "Garansi Kualitas 100%"}</h4>
                <p className="text-sm text-stone-500 whitespace-pre-line">{settings.aboutGuaranteeDesc || "Material premium tahan lama."}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 text-[#b89341]/5">
              <Eye size={120} />
            </div>
            <div className="w-14 h-14 bg-[#b89341]/10 rounded-2xl flex items-center justify-center text-[#b89341] mb-8 relative z-10">
              <Eye size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4 relative z-10">Visi Kami</h3>
            <p className="text-stone-600 leading-relaxed relative z-10 whitespace-pre-line">
              {settings.aboutVision || "Menjadi brand lokal terkemuka di Indonesia yang dikenal luas akan inovasi dan kualitas produk perlengkapan outdoor, serta menjadi pilihan utama masyarakat dalam mencari perlindungan ekstra untuk aktivitas sehari-hari."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 text-[#b89341]/5">
              <Target size={120} />
            </div>
            <div className="w-14 h-14 bg-[#b89341]/10 rounded-2xl flex items-center justify-center text-[#b89341] mb-8 relative z-10">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4 relative z-10">Misi Kami</h3>
            <ul className="space-y-4 relative z-10">
              {(settings.aboutMission || "Menyediakan produk dengan durabilitas tinggi menggunakan bahan baku terbaik.\nMemberikan pelayanan pelanggan yang cepat, ramah, dan solutif.")
                .split('\n')
                .filter((line: string) => line.trim() !== '')
                .map((missionLine: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="text-[#b89341] shrink-0 mt-1" size={20} />
                    <span className="text-stone-600">{missionLine.trim()}</span>
                  </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Contact Info */}
        <div className="bg-stone-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=1920&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{settings.aboutContactTitle || "Hubungi Kami"}</h2>
            <p className="text-stone-300 max-w-2xl mx-auto mb-10 whitespace-pre-line">
              {settings.aboutContactDesc || "Punya pertanyaan seputar produk, kerja sama, atau pemesanan custom (B2B/Corporate)? Tim kami selalu siap membantu Anda."}
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#b89341] rounded-full flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div className="text-left">
                  <p className="text-stone-400 text-sm">Telepon / WhatsApp</p>
                  <p className="font-bold text-lg">{settings?.whatsapp || "+62 813 7509 422"}</p>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-12 bg-stone-700"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#b89341] rounded-full flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <p className="text-stone-400 text-sm">Lokasi Kami</p>
                  <p className="font-bold text-lg">{settings?.address || "Jakarta Selatan, Indonesia"}</p>
                </div>
              </div>
            </div>
            
            <a 
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-10 px-8 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-100 transition-colors shadow-xl"
            >
              Chat dengan Admin Sekarang
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
