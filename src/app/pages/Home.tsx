import { HeroSection } from "../components/sections/HeroSection";
import { BrandMarqueeSection } from "../components/sections/BrandMarqueeSection";
import { TrustSection } from "../components/sections/TrustSection";
import { FeaturedProducts } from "../components/sections/FeaturedProducts";
import { CategorySection } from "../components/sections/CategorySection";
import { CustomOrderSection } from "../components/sections/CustomOrderSection";
import { GallerySection } from "../components/sections/GallerySection";
import { VideoSection } from "../components/sections/VideoSection";
import { ProcessSection } from "../components/sections/ProcessSection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { FAQSection } from "../components/sections/FAQSection";
import { CTASection } from "../components/sections/CTASection";

export function Home() {
  return (
    <>
      <HeroSection />
      <BrandMarqueeSection />
      <TrustSection />
      <FeaturedProducts />
      <CategorySection />
      <CustomOrderSection />
      <GallerySection />
      <VideoSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
