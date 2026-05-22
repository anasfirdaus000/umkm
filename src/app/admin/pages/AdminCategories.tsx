import { useState, useEffect } from "react";
import { Trash2, Plus, Package, Edit2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

const API = "http://localhost:5000";

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/cms/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setName(category.name);
    setDescription(category.description || "");
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingId 
        ? `${API}/api/cms/categories/${editingId}` 
        : `${API}/api/cms/categories`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan kategori");

      alert(`Kategori berhasil ${editingId ? "diperbarui" : "ditambahkan"}!`);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan kategori.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/cms/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus kategori");

      alert("Kategori berhasil dihapus!");
      if (editingId === id) resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus kategori.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-500">
        <Package className="animate-pulse mr-2" size={20} />
        Memuat data kategori...
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
            Kelola Kategori
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            {categories.length} kategori terdaftar
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
          {showForm && !editingId ? "Tutup Form" : "Tambah Kategori"}
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold text-[#b89341] border-b pb-3 mb-5">
            {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none max-w-lg"
                placeholder="Contoh: Batik Tulis"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-transparent outline-none h-24 resize-none max-w-lg"
                placeholder="Deskripsi singkat untuk kategori ini..."
              />
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
                    <Plus size={16} /> Simpan Kategori
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>
              Belum ada kategori. Klik &quot;Tambah Kategori&quot; untuk
              memulai.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#b89341]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-[#b89341]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-800">{cat.name}</h4>
                    {cat.description && (
                      <p className="text-sm text-stone-500 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-[#b89341] hover:text-[#8e7130] hover:bg-[#b89341]/10 p-2 rounded-lg transition-colors flex-shrink-0"
                    title="Edit kategori"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                    title="Hapus kategori"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
