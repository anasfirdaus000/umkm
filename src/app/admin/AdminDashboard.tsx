import { API_URL } from "../../config";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, Building2, Star, HelpCircle, Image as ImageIcon, Video, Wrench, Tags } from "lucide-react";

const API = `${API_URL}/api`;

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    galleries: 0,
    videos: 0,
    testimonials: 0,
    faqs: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = [
          { key: "products", url: `${API}/products` },
          { key: "categories", url: `${API}/cms/categories` },
          { key: "brands", url: `${API}/cms/brands` },
          { key: "galleries", url: `${API}/cms/galleries` },
          { key: "videos", url: `${API}/cms/videos` },
          { key: "testimonials", url: `${API}/cms/testimonials` },
          { key: "faqs", url: `${API}/cms/faqs` },
          { key: "services", url: `${API}/cms/services` },
        ];

        const results = await Promise.allSettled(
          endpoints.map(ep => fetch(ep.url).then(r => r.json()))
        );

        const newStats: any = {};
        results.forEach((result, i) => {
          if (result.status === "fulfilled" && Array.isArray(result.value)) {
            newStats[endpoints[i].key] = result.value.length;
          } else {
            newStats[endpoints[i].key] = 0;
          }
        });

        setStats(newStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Produk", value: stats.products, icon: Package, color: "bg-blue-50 text-blue-600", link: "/admin/products" },
    { label: "Kategori", value: stats.categories, icon: Tags, color: "bg-green-50 text-green-600", link: "/admin/categories" },
    { label: "Mitra & Merk", value: stats.brands, icon: Building2, color: "bg-amber-50 text-amber-600", link: "/admin/brands" },
    { label: "Galeri", value: stats.galleries, icon: ImageIcon, color: "bg-purple-50 text-purple-600", link: "/admin/gallery" },
    { label: "Video", value: stats.videos, icon: Video, color: "bg-rose-50 text-rose-600", link: "/admin/videos" },
    { label: "Testimoni", value: stats.testimonials, icon: Star, color: "bg-yellow-50 text-yellow-600", link: "/admin/testimonials" },
    { label: "FAQ", value: stats.faqs, icon: HelpCircle, color: "bg-cyan-50 text-cyan-600", link: "/admin/faq" },
    { label: "Layanan", value: stats.services, icon: Wrench, color: "bg-indigo-50 text-indigo-600", link: "/admin/services" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Selamat Datang di CMS Admin</h2>
        <p className="text-stone-500 mt-1">
          Kelola seluruh konten website Anda dari satu tempat. Semua perubahan akan langsung tampil di halaman publik.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:shadow-md hover:border-[#b89341]/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <span className="text-2xl font-bold text-stone-800 group-hover:text-[#b89341] transition-colors">
                  {loading ? "—" : card.value}
                </span>
              </div>
              <p className="text-sm font-medium text-stone-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-[#b89341]/5 border border-[#b89341]/20 rounded-xl p-6">
        <h3 className="font-semibold text-stone-800 mb-2">Panduan Cepat</h3>
        <ul className="text-sm text-stone-600 space-y-2">
          <li>• Klik menu di sidebar kiri untuk mengelola setiap section website.</li>
          <li>• Setiap halaman menampilkan data yang <strong>sudah tampil di website</strong>, sehingga Anda tahu persis apa yang sedang diedit.</li>
          <li>• Untuk mengubah teks Hero Section, nomor WA, sosmed, dan jam operasional, buka menu <strong>Pengaturan Web</strong>.</li>
          <li>• Klik tombol <strong>"Lihat Website"</strong> di sidebar bawah untuk melihat hasil perubahan Anda secara langsung.</li>
        </ul>
      </div>
    </div>
  );
}
