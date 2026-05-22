import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router";
import { LayoutDashboard, Settings, Package, Image as ImageIcon, LogOut, MessageSquare, Tags, Building2, Star, HelpCircle, Video, Wrench } from "lucide-react";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuGroups = [
    {
      label: "Utama",
      items: [
        { name: "Beranda", path: "/admin", icon: LayoutDashboard },
      ]
    },
    {
      label: "Katalog",
      items: [
        { name: "Produk & Katalog", path: "/admin/products", icon: Package },
        { name: "Kategori", path: "/admin/categories", icon: Tags },
      ]
    },
    {
      label: "Konten & Media",
      items: [
        { name: "Mitra & Merk", path: "/admin/brands", icon: Building2 },
        { name: "Galeri Inspirasi", path: "/admin/gallery", icon: ImageIcon },
        { name: "Video Showcase", path: "/admin/videos", icon: Video },
        { name: "Layanan Spesial", path: "/admin/services", icon: Wrench },
      ]
    },
    {
      label: "Interaksi",
      items: [
        { name: "Testimoni", path: "/admin/testimonials", icon: Star },
        { name: "FAQ", path: "/admin/faq", icon: HelpCircle },
      ]
    },
    {
      label: "Sistem",
      items: [
        { name: "Pengaturan Web", path: "/admin/settings", icon: Settings },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-950 text-white flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-xl font-bold text-[#b89341]">MORVA ADMIN</h2>
          <p className="text-stone-500 text-xs mt-1">CMS Dashboard v2</p>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold px-3 mb-2">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                        isActive(item.path)
                          ? 'bg-[#b89341] text-white shadow-lg shadow-[#b89341]/20' 
                          : 'text-stone-400 hover:bg-stone-800/60 hover:text-white'
                      }`}
                    >
                      <Icon size={17} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="p-3 border-t border-stone-800">
          <Link to="/" className="flex items-center gap-3 w-full px-3 py-2.5 text-stone-400 hover:bg-stone-800/60 hover:text-white rounded-lg transition-all text-sm mb-1">
            <LayoutDashboard size={17} />
            <span className="font-medium">Lihat Website</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-stone-400 hover:bg-red-900/30 hover:text-red-400 rounded-lg transition-all text-sm"
          >
            <LogOut size={17} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col ml-64">
        <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="font-semibold text-stone-700 text-sm">Dashboard Admin</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">Halo, Admin!</span>
            <div className="w-8 h-8 bg-[#b89341] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>
        
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
