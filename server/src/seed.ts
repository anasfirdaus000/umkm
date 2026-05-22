import prisma from './lib/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('Starting seed...');

  // 1. Setup Admin (admin / admin123)
  const existingAdmin = await prisma.admin.findUnique({ where: { username: 'admin' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: { username: 'admin', password: hashedPassword }
    });
    console.log('Admin seeded.');
  }

  // 2. SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global' }
  });
  console.log('SiteSettings seeded.');

  // 3. Brands (Mitra)
  const brands = [
    { name: 'Kementerian Kelautan', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' },
    { name: 'Pelindo', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' },
    { name: 'PTPN', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' }
  ];
  for (const b of brands) {
    await prisma.brand.create({ data: b });
  }
  console.log('Brands seeded.');

  // 4. Categories
  await prisma.category.createMany({
    data: [
      { name: 'Jas Hujan' },
      { name: 'Cover Motor' },
      { name: 'Cover Mobil' },
    ]
  });
  console.log('Categories seeded.');

  // 5. Testimonials
  const testimonials = [
    { name: 'Budi Santoso', role: 'Pengendara Motor', content: 'Jas hujan Morva sangat awet! Sudah dipakai 2 tahun masih bagus tidak rembes sama sekali.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80' },
    { name: 'Siti Aminah', role: 'Ibu Rumah Tangga', content: 'Cover motornya pas banget untuk NMAX, bahannya tebal dan benar-benar anti air.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' }
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('Testimonials seeded.');

  // 6. Faqs
  const faqs = [
    { question: 'Apakah bahan jas hujannya mudah robek?', answer: 'Tidak, kami menggunakan material PVC premium dengan ketebalan 0.25mm yang sangat kuat dan elastis.' },
    { question: 'Apakah bisa melayani pemesanan custom untuk instansi?', answer: 'Tentu saja! Kami berpengalaman melayani pesanan ratusan pcs untuk berbagai instansi pemerintah maupun swasta lengkap dengan sablon logo.' }
  ];
  for (const f of faqs) {
    await prisma.faq.create({ data: f });
  }
  console.log('FAQs seeded.');

  // 7. Products (Dummy)
  const p1 = await prisma.product.create({
    data: {
      name: 'Jas Hujan Premium Original',
      category: 'Jas Hujan',
      price: 250000,
      description: 'Jas Hujan dengan kualitas jahitan ganda berselotip anti rembes.',
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'dummy1' }] },
      sizes: { create: [{ name: 'L' }, { name: 'XL' }] },
      variants: { create: [{ name: 'Hitam' }, { name: 'Navy' }] }
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Cover Motor NMAX/PCX Ultimate',
      category: 'Cover Motor',
      price: 185000,
      description: 'Sarung motor tebal menolak air seperti daun talas.',
      isFeatured: true,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'dummy2' }] },
      sizes: { create: [{ name: 'All Size' }] },
      variants: { create: [{ name: 'Silver' }, { name: 'Merah' }] }
    }
  });
  console.log('Products seeded.');

  console.log('Seeding finished.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
