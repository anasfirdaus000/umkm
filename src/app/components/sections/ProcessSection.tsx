import { motion } from "motion/react";
import { Search, MessageCircle, CreditCard, Truck } from "lucide-react";

export function ProcessSection() {
  const steps = [
    { icon: <Search size={24} />, title: "Pilih Produk", desc: "Cari produk dari katalog atau siapkan referensi custom." },
    { icon: <MessageCircle size={24} />, title: "Klik WhatsApp", desc: "Hubungi admin kami untuk konsultasi & ketersediaan." },
    { icon: <CreditCard size={24} />, title: "Pembayaran", desc: "Lakukan pembayaran DP atau full via transfer bank." },
    { icon: <Truck size={24} />, title: "Pengiriman", desc: "Pesanan diproses dan dikirim ke alamat Anda." },
  ];

  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
      {/* V2 Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b89341]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-700/30 rounded-full blur-[150px]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Cara Pemesanan</h2>
          <p className="text-stone-400">Proses mudah dan aman, langsung terhubung dengan tim kami.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#b89341]/0 via-[#b89341]/50 to-[#b89341]/0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-stone-800/80 backdrop-blur-md border border-stone-700 flex items-center justify-center text-[#b89341] mb-6 shadow-2xl shadow-black/50 z-10 group hover:-translate-y-2 transition-transform duration-300">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#b89341] text-white font-bold text-sm flex items-center justify-center border-2 border-stone-900">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-stone-400 text-sm max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
