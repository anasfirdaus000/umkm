import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const API = "http://localhost:5000";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/cms/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Auto scroll setup (simple interval for demonstration)
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      }
    }, 4000);

    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimoni" className="py-24 bg-stone-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#b89341] font-medium tracking-wider text-sm uppercase mb-3 block">
            Kata Mereka
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
            Dipercaya Ratusan <br /> Pelanggan
          </h2>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {testimonials.map((testi, index) => (
              <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_40%] pl-4 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[2rem] shadow-xl shadow-stone-200/50 relative h-full flex flex-col"
                >
                  <Quote className="absolute top-6 right-8 text-stone-100 rotate-180" size={60} />
                  
                  <div className="flex gap-1 mb-6 text-yellow-400">
                    {Array.from({ length: testi.rating || 5 }).map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" className="text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-stone-600 text-lg leading-relaxed flex-1 mb-8 relative z-10">
                    "{testi.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testi.avatarUrl?.startsWith('http') ? testi.avatarUrl : `${API}${testi.avatarUrl}`} 
                      alt={testi.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-stone-100"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900">{testi.name}</h4>
                      <p className="text-sm text-stone-500">{testi.role}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "w-8 bg-[#b89341]" : "bg-stone-300 hover:bg-stone-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
