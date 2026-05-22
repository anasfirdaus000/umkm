import { useState, useEffect } from "react";
import { motion } from "motion/react";

const API = "http://localhost:5000";

export function BrandMarqueeSection() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/cms/brands`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(err => console.error(err));
  }, []);

  // Duplicate arrays to create a seamless infinite loop
  const topRow = [...brands, ...brands];
  const bottomRow = [...brands, ...brands].reverse();

  return (
    <section className="py-16 bg-white overflow-hidden border-b border-stone-100">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Mitra & Merk Terpercaya</h3>
        <p className="text-stone-500">Berbagai merk premium yang mempercayakan kualitasnya kepada kami.</p>
      </div>

      <div className="flex flex-col gap-8 relative">
        {/* Fading Edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Top Row: Moves Left (from 0 to -50%) */}
        <div className="flex w-[200%] max-w-none overflow-hidden">
          <div className="flex w-fit gap-8 px-4 animate-marquee">
            {topRow.map((brand, index) => (
              <div key={`top-${index}`} className="flex-shrink-0 w-40 h-20 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center p-4 hover:shadow-md transition-shadow grayscale hover:grayscale-0">
                <img src={brand.logoUrl?.startsWith('http') ? brand.logoUrl : `${API}${brand.logoUrl}`} alt={brand.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Moves Right (from -50% to 0) */}
        <div className="flex w-[200%] max-w-none overflow-hidden">
          <div className="flex w-fit gap-8 px-4 animate-marquee-reverse">
            {bottomRow.map((brand, index) => (
              <div key={`bottom-${index}`} className="flex-shrink-0 w-40 h-20 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center p-4 hover:shadow-md transition-shadow grayscale hover:grayscale-0">
                <img src={brand.logoUrl?.startsWith('http') ? brand.logoUrl : `${API}${brand.logoUrl}`} alt={brand.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
