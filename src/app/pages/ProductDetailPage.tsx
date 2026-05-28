import { API_URL, getImageUrl as getPublicImageUrl } from "../../config";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { MessageCircle, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppUrl } = useSettings();

  const [mainImage, setMainImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/products/${id}`).then(res => res.json()),
      fetch(`${API_URL}/api/cms/categories`).then(res => res.json())
    ])
    .then(([productData, categoriesData]) => {
      setProduct(productData);
      setCategoriesList(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0].name || productData.variants[0]);
      }
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0].name || productData.sizes[0]);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [id]);

  const getCategoryName = (categoryIdOrObj: any) => {
    if (typeof categoryIdOrObj === 'object' && categoryIdOrObj !== null) return categoryIdOrObj.name;
    const found = categoriesList.find(c => c.id === categoryIdOrObj || c.name === categoryIdOrObj);
    return found ? found.name : categoryIdOrObj;
  };

  if (loading) return <div className="pt-32 pb-24 text-center">Memuat detail produk...</div>;
  if (!product) return <div className="pt-32 pb-24 text-center">Produk tidak ditemukan.</div>;

  const getImageUrl = (img: any) => {
    if (!img) return "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop";
    const url = typeof img === 'object' ? img.url : img;
    return getPublicImageUrl(url);
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [null];

  const formatPrice = (val: number | string) => {
    const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, '')) : val;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);
  };



  const waMessage = `Halo kak, saya ingin pesan produk:
*${product.name}*
- Warna/Varian: ${selectedVariant}
- Ukuran: ${selectedSize}

Apakah stoknya tersedia?`;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-6">
        
        {/* Back Button */}
        <Link to="/kategori" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#b89341] transition-colors mb-8 font-medium">
          <ArrowLeft size={20} />
          <span>Kembali ke Katalog</span>
        </Link>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={mainImage}
                className="aspect-square rounded-2xl overflow-hidden bg-stone-100"
              >
                <img 
                  src={getImageUrl(imagesList[mainImage])} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {imagesList.map((img: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${mainImage === idx ? 'border-[#b89341]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-[#b89341] font-bold tracking-wider text-sm uppercase mb-2">
                {getCategoryName(product.category)}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
                {product.name}
              </h1>
              <span className="text-2xl font-bold text-stone-900 mb-6 block">
                {formatPrice(product.price)}
              </span>

              <p className="text-stone-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Pilih Warna/Varian</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v: any, idx: number) => {
                      const vName = typeof v === 'object' ? v.name : v;
                      return (
                        <button 
                          key={idx}
                          onClick={() => setSelectedVariant(vName)}
                          className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                            selectedVariant === vName 
                            ? 'border-[#b89341] bg-[#b89341] text-white' 
                            : 'border-stone-200 text-stone-600 hover:border-[#b89341] hover:text-[#b89341]'
                          }`}
                        >
                          {vName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Pilih Ukuran</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((s: any, idx: number) => {
                      const sName = typeof s === 'object' ? s.name : s;
                      return (
                        <button 
                          key={idx}
                          onClick={() => setSelectedSize(sName)}
                          className={`min-w-[4rem] px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                            selectedSize === sName 
                            ? 'border-[#b89341] bg-[#b89341]/10 text-[#b89341]' 
                            : 'border-stone-200 text-stone-600 hover:border-[#b89341] hover:text-[#b89341]'
                          }`}
                        >
                          {sName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Button */}
              <a 
                href={getWhatsAppUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#20b858] transition-colors shadow-lg shadow-[#25D366]/30 mb-8"
              >
                <MessageCircle size={24} />
                Pesan via WhatsApp
              </a>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-stone-200 pt-8 mt-auto">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="text-[#b89341]" size={24} />
                  <span className="text-xs font-medium text-stone-600">Garansi Kualitas</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="text-[#b89341]" size={24} />
                  <span className="text-xs font-medium text-stone-600">Pengiriman Aman</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="text-[#b89341]" size={24} />
                  <span className="text-xs font-medium text-stone-600">Bisa Retur</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
