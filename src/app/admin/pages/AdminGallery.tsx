import { useState, useEffect, FormEvent } from "react";
import { Trash2, Plus, Image } from "lucide-react";

const API_BASE = "http://localhost:5000";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const token = localStorage.getItem("adminToken");

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cms/galleries`);
      if (!res.ok) throw new Error("Gagal memuat data galeri");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError("File gambar wajib dipilih");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("imageUrl", imageFile);
      formData.append("caption", caption.trim());

      const res = await fetch(`${API_BASE}/api/cms/galleries`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message ?? "Gagal menambahkan gambar");
      }

      setSuccess("Gambar berhasil ditambahkan!");
      setCaption("");
      setImageFile(null);
      const fileInput = document.getElementById("gallery-image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      fetchGalleries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      setError("");
      const res = await fetch(`${API_BASE}/api/cms/galleries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus gambar");

      setSuccess("Gambar berhasil dihapus!");
      fetchGalleries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Image className="w-8 h-8 text-[#b89341]" />
        <h1 className="text-2xl md:text-3xl font-bold">
          Kelola <span className="text-[#b89341]">Galeri Inspirasi</span>
        </h1>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200 text-sm">
          {success}
        </div>
      )}

      {/* Add Gallery Item Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#b89341]" />
          Tambah Gambar Baru
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-400 mb-1">File Gambar</label>
            <input
              id="gallery-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#b89341] file:text-white file:font-medium file:cursor-pointer hover:file:bg-[#a07e35] transition-colors"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-400 mb-1">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Deskripsi gambar..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#b89341] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#b89341] hover:bg-[#a07e35] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Mengunggah..." : "Tambah"}
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">
            Koleksi Galeri ({items.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-[#b89341] border-t-transparent rounded-full mx-auto mb-3" />
            Memuat data...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Belum ada gambar di galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-[#b89341]/50 transition-colors"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.imageUrl.startsWith("http") ? item.imageUrl : `${API_BASE}${item.imageUrl}`}
                    alt={item.caption || "Gallery image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-300 truncate flex-1">
                    {item.caption || <span className="text-gray-500 italic">Tanpa caption</span>}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors shrink-0"
                    title="Hapus gambar"
                  >
                    <Trash2 className="w-4 h-4" />
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

export { AdminGallery };
