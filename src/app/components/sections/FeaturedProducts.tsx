import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router";
import { useSettings } from "../../context/SettingsContext";

const API = "http://localhost:5000";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const { getWhatsAppUrl } = useSettings();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/products/featured`).then(res => res.json()),
      fetch(`${API}/api/cms/categories`).then(res => res.json())
    ])
    .then(([productsData, categoriesData]) => {
      if (Array.isArray(productsData)) setProducts(productsData);
      else if (productsData.products) setProducts(productsData.products);
      
      setCategoriesList(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
    })
    .catch(err => console.error(err));
  }, []);

  const getCategoryName = (categoryIdOrObj: any) => {
    if (typeof categoryIdOrObj === 'object' && categoryIdOrObj !== null) return categoryIdOrObj.name;
    const found = categoriesList.find(c => c.id === categoryIdOrObj || c.name === categoryIdOrObj);
    return found ? found.name : categoryIdOrObj;
  };

  const formatPrice = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  return (
    <section id="produk" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <span className="text-[#b89341] font-medium tracking-wider text-sm uppercase mb-3 block">
              Koleksi Terbaik
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Produk <span className="text-[#b89341]">Unggulan</span> Kami
            </h2>
          </div>
          <a href="/kategori" className="mt-6 md:mt-0 text-stone-900 font-medium border-b border-stone-900 pb-1 hover:text-[#b89341] hover:border-[#b89341] transition-colors">
            Lihat Semua Produk
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
                <img
                  src={
                    product.images && product.images.length > 0 
                      ? (product.images[0].url || product.images[0]).startsWith('http') 
                        ? (product.images[0].url || product.images[0])
                        : `${API}${(product.images[0].url || product.images[0])}`
                      : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Action Buttons */}
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

              {/* Content */}
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
      </div>
    </section>
  );
}
