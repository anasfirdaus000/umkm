import { API_URL, getImageUrl } from "../../config";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "motion/react";
import { MessageCircle, Eye, Search, SlidersHorizontal } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export function CategoryPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("kategori");
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || "Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const { getWhatsAppUrl } = useSettings();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setAllProducts(Array.isArray(data) ? data : data.products || []))
      .catch(console.error);

    // Fetch categories
    fetch(`${API_URL}/api/cms/categories`)
      .then(res => res.json())
      .then(data => setCategoriesList(Array.isArray(data) ? data : data.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Use dynamic category names
  const dynamicCategories = ["Semua Kategori", ...categoriesList.map(c => c.name)];

  const formatPrice = (val: number | string) => {
    const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, '')) : val;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);
  };

  const getCategoryName = (categoryIdOrObj: any) => {
    if (typeof categoryIdOrObj === 'object' && categoryIdOrObj !== null) return categoryIdOrObj.name;
    const found = categoriesList.find(c => c.id === categoryIdOrObj || c.name === categoryIdOrObj);
    return found ? found.name : categoryIdOrObj;
  };

  const filteredProducts = allProducts.filter(product => {
    const categoryName = getCategoryName(product.category);
    const matchesCategory = activeCategory === "Semua Kategori" || categoryName === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/\D/g, '')) : a.price;
    const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/\D/g, '')) : b.price;
    if (sortOrder === "terbaru") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === "termurah") return priceA - priceB;
    if (sortOrder === "termahal") return priceB - priceA;
    return 0;
  });

  if (loading) return <div className="pt-32 pb-24 text-center">Memuat katalog...</div>;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-6">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              Katalog <span className="text-[#b89341]">Produk</span>
            </h1>
            <p className="text-stone-600 max-w-xl">
              Jelajahi koleksi lengkap kami. Temukan produk berkualitas premium untuk menemani setiap petualangan Anda.
            </p>
          </div>

          <div className="w-full md:w-auto relative">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 rounded-full border border-stone-200 focus:outline-none focus:border-[#b89341] focus:ring-1 focus:ring-[#b89341] transition-all bg-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar / Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 sticky top-28">
              <div className="flex items-center gap-3 font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100">
                <SlidersHorizontal size={20} className="text-[#b89341]" />
                Filter Kategori
              </div>
              <ul className="space-y-3">
                {dynamicCategories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${activeCategory === cat ? 'bg-[#b89341]/10 text-[#b89341]' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-stone-500 font-medium text-sm">
                Menampilkan <span className="text-stone-900 font-bold">{sortedProducts.length}</span> produk
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-500 hidden sm:block">Urutkan:</span>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-[#b89341] focus:border-[#b89341] block p-2.5 outline-none cursor-pointer font-medium"
                >
                  <option value="default">Relevansi</option>
                  <option value="terbaru">Terbaru</option>
                  <option value="termurah">Harga Terendah</option>
                  <option value="termahal">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
                      <img
                        src={
                          product.images && product.images.length > 0 
                            ? getImageUrl(product.images[0].url || product.images[0])
                            : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Link to={`/produk/${product.id}`} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-stone-900 hover:text-[#b89341] shadow-lg translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                          <Eye size={20} />
                        </Link>
                        <a
                          href={getWhatsAppUrl(`Halo kak, saya tertarik dengan ${product.name}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20b858] translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={20} />
                        </a>
                      </div>
                    </div>

                    <Link to={`/produk/${product.id}`} className="p-6 flex flex-col flex-1 cursor-pointer">
                      <span className="text-[#b89341] text-xs font-bold uppercase tracking-wider mb-2">
                        {getCategoryName(product.category)}
                      </span>
                      <h3 className="text-stone-900 font-serif text-xl font-bold mb-3 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-stone-100">
                <Search className="w-16 h-16 text-stone-300 mb-4" />
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-stone-500 max-w-md">Belum ada produk yang cocok dengan pencarian Anda saat ini. Silakan coba kata kunci lain atau pilih kategori lainnya.</p>
                <button 
                  onClick={() => {
                    setActiveCategory("Semua Kategori");
                    setSearchQuery("");
                  }}
                  className="mt-6 px-6 py-2 bg-[#b89341] text-white rounded-full font-medium hover:bg-[#a07c31] transition-colors"
                >
                  Lihat Semua Produk
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
