import { useState, useEffect, FormEvent } from "react";
import { Trash2, Plus, Building2 } from "lucide-react";

const API_BASE = "http://localhost:5000";

interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const token = localStorage.getItem("adminToken");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cms/brands`);
      if (!res.ok) throw new Error("Gagal memuat data brand");
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logoFile) {
      setError("Nama brand dan logo wajib diisi");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("logoUrl", logoFile);

      const res = await fetch(`${API_BASE}/api/cms/brands`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message ?? "Gagal menambahkan brand");
      }

      setSuccess("Brand berhasil ditambahkan!");
      setName("");
      setLogoFile(null);
      const fileInput = document.getElementById("brand-logo-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus brand ini?")) return;

    try {
      setError("");
      const res = await fetch(`${API_BASE}/api/cms/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus brand");

      setSuccess("Brand berhasil dihapus!");
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Building2 className="w-8 h-8 text-[#b89341]" />
        <h1 className="text-2xl md:text-3xl font-bold">
          Kelola <span className="text-[#b89341]">Mitra & Merk Terpercaya</span>
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

      {/* Add Brand Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#b89341]" />
          Tambah Brand Baru
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-400 mb-1">Nama Brand</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Nike, Adidas..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#b89341] transition-colors"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-400 mb-1">Logo Brand</label>
            <input
              id="brand-logo-input"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#b89341] file:text-white file:font-medium file:cursor-pointer hover:file:bg-[#a07e35] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#b89341] hover:bg-[#a07e35] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Menyimpan..." : "Tambah"}
          </button>
        </form>
      </div>

      {/* Brands Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">
            Daftar Brand ({brands.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-[#b89341] border-t-transparent rounded-full mx-auto mb-3" />
            Memuat data...
          </div>
        ) : brands.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Belum ada brand yang ditambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 text-left text-sm text-gray-400">
                  <th className="px-6 py-3">Logo</th>
                  <th className="px-6 py-3">Nama Brand</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={brand.logoUrl.startsWith("http") ? brand.logoUrl : `${API_BASE}${brand.logoUrl}`}
                        alt={brand.name}
                        className="w-16 h-16 object-contain bg-white rounded-lg p-1"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{brand.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Hapus brand"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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

export { AdminBrands };
