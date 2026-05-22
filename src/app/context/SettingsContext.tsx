import { API_URL } from "../../config";
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
