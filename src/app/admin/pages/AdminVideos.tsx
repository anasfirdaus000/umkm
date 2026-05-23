import { API_URL } from "../../../config";
import { useState, useEffect, FormEvent } from "react";
import { Trash2, Plus, Video } from "lucide-react";

const API_BASE = API_URL;

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const token = localStorage.getItem("adminToken");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cms/videos`);
      if (!res.ok) throw new Error("Gagal memuat data video");
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const resetForm = () => {
    setTitle("");
    setYoutubeUrl("");
    setVideoFile(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!videoFile && !youtubeUrl.trim())) {
      setError("Judul wajib diisi, dan pilih salah satu: Video Lokal ATAU Link YouTube");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (youtubeUrl.trim()) formData.append("youtubeUrl", youtubeUrl.trim());
      if (videoFile) formData.append("videoUrl", videoFile);

      const res = await fetch(`${API_BASE}/api/cms/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 413) {
        throw new Error("Gagal: Ukuran file terlalu besar! Server Vercel membatasi maksimal file 4.5MB. Silakan gunakan opsi Link YouTube.");
      }
      if (res.status === 504) {
        throw new Error("Gagal: Waktu upload habis (Timeout). Koneksi internet lambat atau file terlalu besar untuk diproses server.");
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message ?? "Gagal menambahkan video. Jika file terlalu besar, server otomatis memblokirnya.");
      }

      setSuccess("Video berhasil ditambahkan!");
      resetForm();
      fetchVideos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus video ini?")) return;

    try {
      setError("");
      const res = await fetch(`${API_BASE}/api/cms/videos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus video");

      setSuccess("Video berhasil dihapus!");
      fetchVideos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return "";
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : "";
  };

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Video className="w-8 h-8 text-[#b89341]" />
        <h1 className="text-2xl font-bold text-stone-800">
          Kelola Video Showcase
        </h1>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Add Video Form */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#b89341] border-b pb-3">
          <Plus className="w-5 h-5 text-[#b89341]" />
          Tambah Video Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Judul Video</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tutorial Desain Logo"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-[#b89341] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Pilihan 1: Link YouTube / Google Drive</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Contoh: https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-800 focus:ring-2 focus:ring-[#b89341] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Pilihan 2: Upload File Video Lokal (Max 50MB)</label>
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#b89341] file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-[#a07c33]"
              />
              <p className="text-xs text-stone-500 mt-2">Pilih salah satu saja. Jika mengisi Link YouTube, file lokal akan diabaikan (atau sebaliknya). <br/><span className="text-red-500 font-semibold">*Catatan Vercel:</span> Upload file lokal besar mungkin terblokir oleh limit server Vercel (4.5MB). Menggunakan Link YouTube sangat disarankan.</p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#b89341] hover:bg-[#a07e35] disabled:opacity-50 text-white font-semibold rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {submitting ? "Menyimpan..." : "Tambah Video"}
            </button>
          </div>
        </form>
      </div>

      {/* Videos Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            Daftar Video ({videos.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-500">
            Memuat data...
          </div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Belum ada video yang ditambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left text-xs font-semibold text-stone-500 uppercase">
                  <th className="px-6 py-4">Media</th>
                  <th className="px-6 py-4">Judul</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      {video.videoUrl ? (
                        <video src={video.videoUrl.startsWith('http') ? video.videoUrl : `${API_BASE}${video.videoUrl}`} className="w-32 h-20 object-cover rounded-lg border border-stone-200" controls />
                      ) : video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={video.title} className="w-32 h-20 object-cover rounded-lg border border-stone-200" />
                      ) : video.youtubeUrl ? (
                        <img src={getYoutubeThumbnail(video.youtubeUrl)} alt={video.title} className="w-32 h-20 object-cover rounded-lg border border-stone-200" />
                      ) : (
                        <div className="w-32 h-20 bg-stone-100 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-stone-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-stone-800 block mb-1">{video.title}</span>
                      {video.videoUrl && (
                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">Video Lokal</span>
                      )}
                      {video.youtubeUrl && (
                        <span className="text-xs text-blue-500">YouTube</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus video"
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

export { AdminVideos };
