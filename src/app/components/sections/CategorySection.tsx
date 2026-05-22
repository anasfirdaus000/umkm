import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Sofa, PaintRoller, Sparkles, PlusCircle, Package } from "lucide-react";

const API = "http://localhost:5000";

const defaultIcons = [
  { icon: <Package size={24} />, color: "bg-blue-100 text-blue-600" },
  { icon: <PaintRoller size={24} />, color: "bg-orange-100 text-orange-600" },
  { icon: <Sparkles size={24} />, color: "bg-yellow-100 text-yellow-600" },
  { icon: <PlusCircle size={24} />, color: "bg-green-100 text-green-600" },
  { icon: <Sofa size={24} />, color: "bg-purple-100 text-purple-600" },
];

export function CategorySection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/cms/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="kategori" className="py-12 bg-white border-t border-stone-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-8 text-center">Jelajahi Kategori</h3>
        
        <div className="flex overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6 lg:justify-center gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/kategori?kategori=${encodeURIComponent(cat.name)}`)}
              className="flex-shrink-0 flex items-center gap-4 bg-stone-50 border border-stone-100 p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all min-w-[200px]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${defaultIcons[index % defaultIcons.length].color}`}>
                {defaultIcons[index % defaultIcons.length].icon}
              </div>
              <span className="font-medium text-stone-800">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
