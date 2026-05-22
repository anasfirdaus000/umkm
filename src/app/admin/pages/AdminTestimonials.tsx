import { API_URL } from "../../../config";
import { useState, useEffect } from "react";
import { Trash2, Plus, Star, MessageSquare } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
}

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cms/testimonials`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTestimonials(data);
      } else {
        console.error("API returned non-array:", data);
        setTestimonials([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus testimonial ini?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/api/cms/testimonials/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus testimonial.");
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("role", (form.elements.namedItem("role") as HTMLInputElement).value);
    formData.append("content", (form.elements.namedItem("content") as HTMLTextAreaElement).value);
    formData.append("rating", (form.elements.namedItem("rating") as HTMLInputElement).value);

    if (avatarFile) {
      formData.append("avatarUrl", avatarFile);
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/cms/testimonials`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Gagal menambahkan testimonial");

      form.reset();
      setAvatarFile(null);
      fetchTestimonials();
      alert("Testimonial berhasil ditambahkan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-[#b89341] text-[#b89341]" : "text-stone-300"}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="text-[#b89341]" size={28} />
        <h2 className="text-2xl font-bold text-stone-800">Kelola Kata Mereka (Testimonial)</h2>
      </div>

      {/* Add Form */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-[#b89341] border-b border-stone-200 pb-3 mb-6">
          Tambah Testimonial Baru
        </h3>
        <form onSubmit={handleAdd} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nama</label>
              <input
                name="name"
                required
                type="text"
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-[#b89341] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Role / Jabatan</label>
              <input
                name="role"
                required
                type="text"
                placeholder="Contoh: Pemilik Toko Kue"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-[#b89341] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Isi Testimonial</label>
            <textarea
              name="content"
              required
              rows={4}
              placeholder="Tuliskan kata-kata pelanggan..."
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-[#b89341] outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Rating (1-5)</label>
              <input
                name="rating"
                required
                type="number"
                min={1}
                max={5}
                defaultValue={5}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] focus:border-[#b89341] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Foto Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#b89341] file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-[#a07c33]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#b89341] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#a07c33] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              <Plus size={18} />
              {submitting ? "Menambahkan..." : "Tambah Testimonial"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Testimonials List */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-6">
          Daftar Testimonial ({testimonials.length})
        </h3>

        {loading ? (
          <p className="text-stone-500">Memuat data...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-stone-400 text-center py-8">Belum ada testimonial. Tambahkan yang pertama!</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="border border-stone-200 rounded-lg p-5 flex items-start gap-4 hover:border-[#b89341]/30 transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl.startsWith("http") ? item.avatarUrl : `${API_URL}${item.avatarUrl}`}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#b89341]/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#b89341]/10 flex items-center justify-center text-[#b89341] font-bold text-lg">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-stone-800">{item.name}</h4>
                    <span className="text-sm text-[#b89341] bg-[#b89341]/10 px-2 py-0.5 rounded-full">
                      {item.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(item.rating)}
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">"{item.content}"</p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Hapus testimonial"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
