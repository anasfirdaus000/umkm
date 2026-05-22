import { useState, useEffect } from "react";
import { Trash2, Plus, Star, Package, Edit2, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string | { id: string; name: string };
  price: number;
  description: string;
  isFeatured: boolean;
  variants: any[];
  sizes: any[];
  images: any[];
}

interface Category {
  id: string;
  name: string;
}

const API = "http://localhost:5000";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [variantsText, setVariantsText] = useState("");
  const [sizesText, setSizesText] = useState("");
  
  // Existing images handling
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/cms/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setIsFeatured(false);
    setVariantsText("");
    setSizesText("");
    setExistingImages([]);
    setImageFiles(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setCategory(typeof product.category === 'object' && product.category !== null ? product.category.id : product.category);
    setPrice(product.price.toString());
    setDescription(product.description || "");
    setIsFeatured(product.isFeatured || false);
    
    // Map variants and sizes back to comma-separated text
    const vText = product.variants ? product.variants.map((v: any) => v.name || v).join(", ") : "";
    const sText = product.sizes ? product.sizes.map((s: any) => s.name || s).join(", ") : "";
    setVariantsText(vText);
    setSizesText(sText);
    
    setExistingImages(product.images || []);
    setImageFiles(null);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("isFeatured", String(isFeatured));

      // Parse comma-separated values into JSON arrays
      const variantsArray = variantsText
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const sizesArray = sizesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      formData.append("variants", JSON.stringify(variantsArray));
      formData.append("sizes", JSON.stringify(sizesArray));

      // If editing, send the IDs of the images we want to keep
      if (editingId) {
        const keptImageIds = existingImages.map(img => img.id);
        formData.append("keptImages", JSON.stringify(keptImageIds));
      }

      // Append multiple image files
      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append("images", imageFiles[i]);
        }
      }

      const url = editingId 
        ? `${API}/api/products/${editingId}` 
        : `${API}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal menyimpan produk");

      alert(`Produk berhasil ${editingId ? "diperbarui" : "ditambahkan"}!`);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus produk");

      alert("Produk berhasil dihapus!");
      if (editingId === id) resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk.");
    }
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-500">
        <Package className="animate-pulse mr-2" size={20} />
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Package size={22} className="text-[#b89341]" />
            Kelola Produk
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Katalog &amp; Koleksi Terbaik — {products.length} produk terdaftar
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingId) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="flex items-center gap-2 bg-[#b89341] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#a07c33] transition-colors"
        >
          <Plus size={18} />
          {showForm && !editingId ? "Tutup Form" : "Tambah Produk"}
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-[#b89341] border-b pb-3 mb-5">
            {editingId ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none"
                  placeholder="Contoh: Batik Cap Motif Bunga"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Kategori
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none"
                  placeholder="150000"
                  min="0"
                />
              </div>

              {/* isFeatured */}
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 text-[#b89341] border-stone-300 rounded focus:ring-[#b89341] accent-[#b89341]"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-stone-700 flex items-center gap-1"
                >
                  <Star size={16} className="text-[#b89341]" />
                  Tampilkan di Koleksi Terbaik
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Deskripsi Produk
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none h-24 resize-none"
                placeholder="Deskripsi singkat tentang produk..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Variants */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Varian{" "}
                  <span className="text-stone-400 font-normal">
                    (pisahkan koma)
                  </span>
                </label>
                <input
                  type="text"
                  value={variantsText}
                  onChange={(e) => setVariantsText(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none"
                  placeholder="Merah, Biru, Hijau"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Ukuran{" "}
                  <span className="text-stone-400 font-normal">
                    (pisahkan koma)
                  </span>
                </label>
                <input
                  type="text"
                  value={sizesText}
                  onChange={(e) => setSizesText(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Gambar Produk{" "}
                <span className="text-stone-400 font-normal">
                  (bisa pilih banyak)
                </span>
              </label>
              
              {/* Show existing images if editing */}
              {editingId && existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {existingImages.map(img => (
                    <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200">
                      <img 
                        src={img.url.startsWith('http') ? img.url : `${API}${img.url}`} 
                        alt="Product" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600"
                        title="Hapus gambar ini"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#b89341] file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-[#a07c33]"
              />
              {imageFiles && imageFiles.length > 0 && (
                <p className="text-xs text-stone-500 mt-1">
                  {imageFiles.length} file dipilih
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-lg font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#b89341] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-[#a07c33] transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {submitting ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Plus size={16} /> Simpan Produk
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>Belum ada produk. Klik &quot;Tambah Produk&quot; untuk memulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Gambar
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <td className="px-5 py-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            typeof product.images[0] === 'string' 
                              ? (product.images[0] as string).startsWith("http")
                                ? product.images[0]
                                : `${API}${product.images[0]}`
                              : (product.images[0] as any).url?.startsWith("http")
                                ? (product.images[0] as any).url
                                : `${API}${(product.images[0] as any).url}`
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                          <Package size={18} className="text-stone-300" />
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3">
                      <span className="font-medium text-stone-800">
                        {product.name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3">
                      <span className="text-sm text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                        {(() => {
                          const catId = typeof product.category === "object" && product.category !== null ? (product.category as any).id : product.category;
                          const found = categories.find(c => c.id === catId || c.name === catId);
                          return found ? found.name : catId || "—";
                        })()}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3 text-sm font-semibold text-stone-700">
                      {formatPrice(product.price)}
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-3 text-center">
                      {product.isFeatured ? (
                        <Star
                          size={18}
                          className="text-[#b89341] mx-auto fill-[#b89341]"
                        />
                      ) : (
                        <Star
                          size={18}
                          className="text-stone-300 mx-auto"
                        />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-[#b89341] hover:text-[#8e7130] hover:bg-[#b89341]/10 p-2 rounded-lg transition-colors"
                          title="Edit produk"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Hapus produk"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
