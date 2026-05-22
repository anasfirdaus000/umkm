import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Menu, X, ShoppingBag, Search, ShoppingCart, MessageCircle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getWhatsAppUrl } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Produk", href: "/kategori" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Kategori", href: "/#kategori" },
    { name: "Custom Order", href: "/#custom" },
    { name: "Testimoni", href: "/#testimoni" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.jpeg" alt="MORVA MODE INDONESIA" className="h-12 w-auto object-contain" />
            <span className={`font-serif text-xl font-bold tracking-tight uppercase ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
              MORVA MODE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium hover:text-[#b89341] transition-colors ${
                  isScrolled ? "text-stone-600" : "text-stone-100 drop-shadow-md"
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href={getWhatsAppUrl("Halo kak, saya ingin bertanya tentang produk MORVA MODE.")}
              target="_blank"
              rel="noreferrer"
              className="bg-[#b89341] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#a07c31] transition-colors shadow-lg shadow-[#b89341]/20"
            >
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-stone-800' : 'text-white drop-shadow-md'}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-stone-100">
              <span className="font-serif text-2xl font-bold text-stone-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-stone-100 rounded-full text-stone-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif font-medium text-stone-800 hover:text-[#b89341]"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
            <div className="p-8 bg-stone-50">
              <a
                href={getWhatsAppUrl("Halo kak, saya ingin bertanya tentang produk MORVA MODE.")}
                className="flex justify-center items-center gap-2 bg-[#b89341] text-white w-full py-4 rounded-xl text-lg font-medium shadow-xl shadow-[#b89341]/20"
              >
                Chat via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
