import { API_URL } from "../../../config";
import { useState, useEffect } from "react";
import { Trash2, Plus, HelpCircle } from "lucide-react";

const API = `${API_URL}/api`;

export function AdminInteractions() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API}/cms/faqs`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFaqs(data);
      } else {
        console.error("API returned non-array:", data);
        setFaqs([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus FAQ ini?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API}/cms/faqs/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchFaqs();
      setSuccess("FAQ berhasil dihapus!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus FAQ.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string
    };

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/cms/faqs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Gagal menambahkan FAQ");
      
      e.currentTarget.reset();
      fetchFaqs();
      setSuccess("FAQ berhasil ditambahkan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menambahkan FAQ.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Kelola FAQ</h2>
        <p className="text-stone-500 mt-1">Pertanyaan yang tampil di section "Pertanyaan yang Sering Diajukan" pada website.</p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Add Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Plus size={18} className="text-[#b89341]" /> Tambah FAQ Baru
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Pertanyaan</label>
            <input name="question" required type="text" placeholder="Contoh: Apakah bisa kirim ke luar kota?" className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Jawaban</label>
            <textarea name="answer" required rows={3} placeholder="Tulis jawaban lengkap..." className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#b89341] outline-none" />
          </div>
          <button type="submit" disabled={saving} className="bg-[#b89341] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#a07c33] transition-colors disabled:opacity-70">
            <Plus size={16} /> {saving ? "Menyimpan..." : "Tambah FAQ"}
          </button>
        </form>
      </div>

      {/* Existing FAQ List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <HelpCircle size={18} className="text-[#b89341]" /> FAQ yang Tampil di Website ({faqs.length} item)
        </h3>
        
        {loading ? (
          <div className="text-center py-8 text-stone-500">Memuat data...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8 text-stone-400">Belum ada FAQ. Tambahkan FAQ pertama Anda di atas.</div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="border border-stone-200 p-4 rounded-xl flex justify-between items-start gap-4 hover:bg-stone-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#b89341] bg-[#b89341]/10 px-2 py-0.5 rounded">#{index + 1}</span>
                  </div>
                  <p className="font-semibold text-stone-800">Q: {faq.question}</p>
                  <p className="text-stone-500 mt-1 text-sm">A: {faq.answer}</p>
                </div>
                <button onClick={() => handleDelete(faq.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0" title="Hapus FAQ">
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
