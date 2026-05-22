import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const API = "http://localhost:5000";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/cms/faqs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFaqs(data);
      })
      .catch(err => console.error(err));
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-stone-500 text-lg">Ada pertanyaan? Kami punya jawabannya.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                openIndex === index ? "border-orange-500 bg-orange-50/50" : "border-stone-200 bg-white hover:border-orange-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-stone-900 text-lg pr-8">{faq.question || faq.q}</span>
                <ChevronDown 
                  className={`text-orange-500 transition-transform duration-300 shrink-0 ${openIndex === index ? "rotate-180" : ""}`} 
                  size={24} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-stone-600 border-t border-orange-500/10 pt-4">
                      {faq.answer || faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
