import { API_URL } from "../../../config";
import { useState, useEffect } from "react";
import { Trash2, Plus, Wrench } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const API = `${API_URL}/api`;

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API}/cms/services`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.error("API returned non-array:", data);
        setServices([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus layanan ini?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API}/cms/services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus layanan.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Silakan pilih gambar terlebih dahulu");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("imageUrl", imageFile);

      const res = await fetch(`${API}/cms/services`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
        body: formData
      });

      if (!res.ok) throw new Error("Gagal menambahkan layanan");

      alert("Layanan berhasil ditambahkan!");
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan layanan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Wrench className="text-[#b89341]" size={28} />
        <h2 className="text-2xl font-bold text-stone-800">Kelola Layanan Spesial</h2>
      </div>

      {/* Add Form */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-[#b89341] border-b border-stone-200 pb-3 mb-6">
          Tambah Layanan Baru
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Judul Layanan</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              type="text"
              placeholder="Contoh: Gratis Ongkir"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-[#b89341] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Jelaskan detail layanan ini..."
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-[#b89341] outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Gambar Layanan</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#b89341] file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-[#a07c33]"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#b89341] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#a07c33] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Plus size={18} />
              {saving ? "Menambahkan..." : "Tambah Layanan"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Services List */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-6">
          Daftar Layanan ({services.length})
        </h3>

        {loading ? (
          <p className="text-stone-500">Memuat data...</p>
        ) : services.length === 0 ? (
          <p className="text-stone-400 text-center py-8">Belum ada layanan. Tambahkan yang pertama!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-stone-200 rounded-lg p-5 hover:border-[#b89341]/30 transition-colors group relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-16 h-16 bg-[#b89341]/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {service.imageUrl ? (
                          <img 
                            src={service.imageUrl.startsWith('http') ? service.imageUrl : `${API_URL}${service.imageUrl}`} 
                            alt={service.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Wrench size={24} className="text-[#b89341]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-800 text-lg">{service.title}</h4>
                      </div>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed mt-2">
                      {service.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus layanan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
