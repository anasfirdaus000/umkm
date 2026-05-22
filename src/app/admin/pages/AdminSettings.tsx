import { useState, useEffect } from "react";

export function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroBgFile1, setHeroBgFile1] = useState<File | null>(null);
  const [heroBgFile2, setHeroBgFile2] = useState<File | null>(null);
  const [heroBgFile3, setHeroBgFile3] = useState<File | null>(null);
  const [heroBgFile4, setHeroBgFile4] = useState<File | null>(null);
  const [heroProductFile, setHeroProductFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      
      // Append all settings text fields
      Object.keys(settings).forEach(key => {
        if (!key.startsWith('heroBgUrl') && key !== 'heroProductUrl' && key !== 'id' && key !== 'updatedAt') {
          formData.append(key, settings[key]);
        }
      });

      if (heroBgFile1) formData.append("heroBg1", heroBgFile1);
      if (heroBgFile2) formData.append("heroBg2", heroBgFile2);
      if (heroBgFile3) formData.append("heroBg3", heroBgFile3);
      if (heroBgFile4) formData.append("heroBg4", heroBgFile4);
      if (heroProductFile) formData.append("heroProduct", heroProductFile);

      await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      alert("Pengaturan berhasil disimpan!");
      fetchSettings(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
      <h2 className="text-xl font-bold text-stone-800 mb-6">Pengaturan Umum Website</h2>
      
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Section */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-[#b89341] border-b pb-2">Hero Section</h3>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Hero Title</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                value={settings?.heroTitle || ""}
                onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Hero Description</label>
              <textarea 
                className="w-full px-4 py-2 border border-stone-300 rounded-lg h-24"
                value={settings?.heroDesc || ""}
                onChange={(e) => setSettings({...settings, heroDesc: e.target.value})}
              />
            </div>
            {/* Background Images - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Background Image {num}</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (num === 1) setHeroBgFile1(file);
                      if (num === 2) setHeroBgFile2(file);
                      if (num === 3) setHeroBgFile3(file);
                      if (num === 4) setHeroBgFile4(file);
                    }}
                    className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#b89341]/10 file:text-[#b89341] hover:file:bg-[#b89341]/20 file:cursor-pointer"
                  />
                  {settings?.[`heroBgUrl${num}`] && (
                    <img src={settings[`heroBgUrl${num}`].startsWith('http') ? settings[`heroBgUrl${num}`] : `http://localhost:5000${settings[`heroBgUrl${num}`]}`} alt={`Bg ${num}`} className="mt-2 h-20 object-cover rounded" />
                  )}
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-4">
              <h4 className="font-semibold text-stone-800">Detail Produk Hero</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Judul Produk</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                    value={settings?.heroProductTitle || ""}
                    onChange={(e) => setSettings({...settings, heroProductTitle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Harga Produk</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                    value={settings?.heroProductPrice || ""}
                    onChange={(e) => setSettings({...settings, heroProductPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Keterangan Singkat</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                    value={settings?.heroProductDesc || ""}
                    onChange={(e) => setSettings({...settings, heroProductDesc: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Product Image (Opsional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setHeroProductFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#b89341]/10 file:text-[#b89341] hover:file:bg-[#b89341]/20 file:cursor-pointer"
                  />
                  {settings?.heroProductUrl && !heroProductFile && (
                    <img src={settings.heroProductUrl.startsWith('http') ? settings.heroProductUrl : `http://localhost:5000${settings.heroProductUrl}`} alt="Product" className="mt-2 h-20 object-contain rounded" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div className="space-y-4 md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-[#b89341] border-b pb-2">Kontak & Operasional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nomor WhatsApp</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  value={settings?.whatsapp || ""}
                  onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Jam Operasional</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  value={settings?.operationalHours || ""}
                  onChange={(e) => setSettings({...settings, operationalHours: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Alamat Lengkap</label>
                <textarea 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg h-20"
                  value={settings?.address || ""}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Sosial Media */}
          <div className="space-y-4 md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-[#b89341] border-b pb-2">Sosial Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Instagram URL</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  value={settings?.instagram || ""}
                  onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Facebook URL</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  value={settings?.facebook || ""}
                  onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">TikTok URL</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg"
                  value={settings?.tiktok || ""}
                  onChange={(e) => setSettings({...settings, tiktok: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#b89341] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#a07c33] transition-colors disabled:opacity-70"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
