import { useState, useEffect } from "react";
import { Instagram, Facebook, Twitter, MapPin, Phone, Clock, Mail, PlayCircle } from "lucide-react";

const API = "http://localhost:5000";

export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);
  return (
    <footer className="bg-stone-950 text-stone-300 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.jpeg" alt="MORVA MODE INDONESIA" className="h-10 w-auto object-contain rounded-md" />
              <span className="font-serif text-2xl font-bold text-white uppercase tracking-tight">
                MORVA MODE
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed mb-6">
              Menghadirkan produk outdoor premium, jas hujan, dan cover motor berkualitas terbaik untuk Anda.
            </p>
            <div className="flex gap-4">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Instagram size={18} />
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Facebook size={18} />
                </a>
              )}
              {settings?.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <PlayCircle size={18} />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Tautan Cepat</h4>
            <ul className="space-y-4">
              <li><a href="/" className="hover:text-primary transition-colors">Beranda</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">Tentang Kami</a></li>
              <li><a href="/kategori" className="hover:text-primary transition-colors">Katalog Produk</a></li>
              <li><a href="#custom" className="hover:text-primary transition-colors">Custom Order</a></li>
              <li><a href="#testimoni" className="hover:text-primary transition-colors">Testimoni</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                <span>{settings?.address || "Jakarta Selatan, Indonesia"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary shrink-0" />
                <span>{settings?.whatsapp || "+62 813 7509 422"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <span>morvamodeindonesia90@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-6">Jam Operasional</h4>
            {settings?.operationalHours ? (
              <div className="text-stone-300 whitespace-pre-line leading-loose">
                {settings.operationalHours}
              </div>
            ) : (
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span>Senin - Jumat</span>
                  <span className="text-white">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span>Sabtu</span>
                  <span className="text-white">09:00 - 15:00</span>
                </li>
                <li className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span>Minggu</span>
                  <span className="text-primary font-medium">Tutup</span>
                </li>
              </ul>
            )}
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500">
            &copy; {new Date().getFullYear()} MORVA MODE INDONESIA. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-stone-500">
            <a href="/" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="/" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
