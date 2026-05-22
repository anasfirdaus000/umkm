import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const API = "http://localhost:5000";

export function GallerySection() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/cms/galleries`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Galeri Inspirasi</h2>
          <p className="text-stone-500 max-w-xl mx-auto">Lihat berbagai hasil karya dan inspirasi desain interior dari produk kami.</p>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 1024: 4 }}>
          <Masonry gutter="16px">
            {images.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={item.imageUrl?.startsWith('http') ? item.imageUrl : `${API}${item.imageUrl}`}
                  alt={item.caption || `Gallery ${index}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.caption && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-sm font-medium px-4 text-center">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}
