const fs = require('fs');

const files = [
  'src/app/admin/AdminDashboard.tsx',
  'src/app/admin/AdminLogin.tsx',
  'src/app/admin/pages/AdminBrands.tsx',
  'src/app/admin/pages/AdminCategories.tsx',
  'src/app/admin/pages/AdminGallery.tsx',
  'src/app/admin/pages/AdminInteractions.tsx',
  'src/app/admin/pages/AdminProducts.tsx',
  'src/app/admin/pages/AdminServices.tsx',
  'src/app/admin/pages/AdminSettings.tsx',
  'src/app/admin/pages/AdminTestimonials.tsx',
  'src/app/admin/pages/AdminVideos.tsx',
  'src/app/components/layout/Footer.tsx',
  'src/app/components/sections/BrandMarqueeSection.tsx',
  'src/app/components/sections/CategorySection.tsx',
  'src/app/components/sections/CustomOrderSection.tsx',
  'src/app/components/sections/FAQSection.tsx',
  'src/app/components/sections/FeaturedProducts.tsx',
  'src/app/components/sections/GallerySection.tsx',
  'src/app/components/sections/HeroSection.tsx',
  'src/app/components/sections/TestimonialsSection.tsx',
  'src/app/components/sections/VideoSection.tsx',
  'src/app/context/SettingsContext.tsx',
  'src/app/pages/CategoryPage.tsx',
  'src/app/pages/ProductDetailPage.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  let parts = f.split('/');
  let depth = parts.length - 2; 
  let rel = depth > 0 ? '../'.repeat(depth) : './';
  
  if (content.includes('http://localhost:5000')) {
     if (!content.includes('API_URL')) {
        content = `import { API_URL } from "${rel}config";\n` + content;
     }
     
     content = content.replace(/const API_BASE = "http:\/\/localhost:5000";/g, 'const API_BASE = API_URL;');
     content = content.replace(/const API = "http:\/\/localhost:5000";/g, 'const API = API_URL;');
     content = content.replace(/const API = "http:\/\/localhost:5000\/api";/g, 'const API = `${API_URL}/api`;');
     
     content = content.replace(/fetch\("http:\/\/localhost:5000([^"]*)"/g, 'fetch(`${API_URL}$1`');
     content = content.replace(/fetch\(`http:\/\/localhost:5000([^`]*)`/g, 'fetch(`${API_URL}$1`');
     
     content = content.replace(/`http:\/\/localhost:5000\$\{/g, '`${API_URL}${');
     
     // Specific replacements for images
     content = content.replace(/'http:\/\/localhost:5000\$\{/g, '`${API_URL}${');
     content = content.replace(/"http:\/\/localhost:5000\$\{/g, '`${API_URL}${');
     
     // Generic replacements just in case
     content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${API_URL}$1`');
     content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_URL}$1`');

     fs.writeFileSync(f, content);
     console.log('Updated', f);
  }
});
