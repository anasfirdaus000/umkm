import { API_URL, getImageUrl } from "../../config";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteSettings {
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  address: string;
  operationalHours: string;
  heroTitle: string;
  heroDesc: string;
  heroProductTitle: string;
  heroProductPrice: string;
  heroProductDesc: string;
  heroProductUrl: string;
  heroBgUrl1: string;
  heroBgUrl2: string;
  heroBgUrl3: string;
  heroBgUrl4: string;
  logoUrl?: string;
  aboutSubtitle: string;
  aboutTitle: string;
  aboutImageUrl?: string;
  aboutIntroTitle: string;
  aboutDescription: string;
  aboutVision: string;
  aboutMission: string;
  aboutGuaranteeTitle: string;
  aboutGuaranteeDesc: string;
  aboutContactTitle: string;
  aboutContactDesc: string;
}

const defaultSettings: SiteSettings = {
  whatsapp: "628137509422",
  instagram: "",
  facebook: "",
  tiktok: "",
  address: "",
  operationalHours: "",
  heroTitle: "",
  heroDesc: "",
  heroProductTitle: "",
  heroProductPrice: "",
  heroProductDesc: "",
  heroProductUrl: "",
  heroBgUrl1: "",
  heroBgUrl2: "",
  heroBgUrl3: "",
  heroBgUrl4: "",
  logoUrl: "",
  aboutSubtitle: "Tentang Perusahaan",
  aboutTitle: "Mengenal Lebih Dekat MORVA MODE INDONESIA",
  aboutImageUrl: "",
  aboutIntroTitle: "Penyedia Perlengkapan Outdoor Berkualitas Premium",
  aboutDescription: "MORVA MODE INDONESIA hadir sebagai solusi perlengkapan outdoor dan perlindungan harian Anda. Kami berfokus pada produksi jas hujan premium, cover motor, dan berbagai perlengkapan tahan cuaca lainnya dengan standar kualitas tertinggi.\n\nDengan mengedepankan material terbaik dan proses quality control yang ketat, kami berkomitmen untuk memberikan perlindungan maksimal bagi Anda dan aset berharga Anda dari berbagai kondisi cuaca ekstrim di Indonesia.",
  aboutVision: "Menjadi brand lokal terkemuka di Indonesia yang dikenal luas akan inovasi dan kualitas produk perlengkapan outdoor, serta menjadi pilihan utama masyarakat dalam mencari perlindungan ekstra untuk aktivitas sehari-hari.",
  aboutMission: "Menyediakan produk dengan durabilitas tinggi menggunakan bahan baku terbaik.\nMemberikan pelayanan pelanggan yang cepat, ramah, dan solutif.\nTerus berinovasi menciptakan desain yang ergonomis dan sesuai dengan tren.\nMemberdayakan sumber daya lokal untuk memajukan industri kreatif Indonesia.",
  aboutGuaranteeTitle: "Garansi Kualitas 100%",
  aboutGuaranteeDesc: "Material premium tahan lama.",
  aboutContactTitle: "Hubungi Kami",
  aboutContactDesc: "Punya pertanyaan seputar produk, kerja sama, atau pemesanan custom (B2B/Corporate)? Tim kami selalu siap membantu Anda."
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  getWhatsAppUrl: (text?: string) => string;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  getWhatsAppUrl: () => `https://wa.me/628137509422`
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          // Format phone number to start with 62 instead of 0 or +62
          let wa = data.whatsapp || "628137509422";
          wa = wa.replace(/\D/g, ''); // remove non-digits
          if (wa.startsWith('0')) wa = '62' + wa.substring(1);
          data.whatsapp = wa;
          
          setSettings(prev => ({ ...prev, ...data }));

          // Dynamically update favicon if logoUrl is provided
          if (data.logoUrl) {
            const logoFullUrl = getImageUrl(data.logoUrl);
            const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = logoFullUrl;
            document.getElementsByTagName('head')[0].appendChild(link);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getWhatsAppUrl = (text?: string) => {
    const baseUrl = `https://wa.me/${settings.whatsapp}`;
    return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, getWhatsAppUrl }}>
      {children}
    </SettingsContext.Provider>
  );
}
