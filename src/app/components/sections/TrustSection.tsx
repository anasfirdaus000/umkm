import { motion } from "motion/react";
import { ShieldCheck, Clock, Settings, Truck } from "lucide-react";

export function TrustSection() {
  const trusts = [
    {
      icon: <ShieldCheck size={28} />,
      title: "Produk Berkualitas",
      desc: "Bahan premium pilihan terbaik untuk ketahanan maksimal.",
      color: "from-[#b89341] to-[#d4b46a]",
    },
    {
      icon: <Clock size={28} />,
      title: "Fast Response",
      desc: "Layanan pelanggan siap membantu Anda kapan saja via WhatsApp.",
      color: "from-[#b89341] to-[#d4b46a]",
    },
    {
      icon: <Settings size={28} />,
      title: "Bisa Custom",
      desc: "Sesuaikan ukuran, warna, dan material sesuai kebutuhan.",
      color: "from-[#b89341] to-[#d4b46a]",
    },
    {
      icon: <Truck size={28} />,
      title: "Pengiriman Aman",
      desc: "Packing kayu & asuransi untuk memastikan barang selamat.",
      color: "from-[#b89341] to-[#d4b46a]",
    },
  ];

  return (
    <section className="py-20 bg-stone-50 relative z-20 -mt-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trusts.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-lg shadow-stone-200/50 group hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Animated Border/Glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
