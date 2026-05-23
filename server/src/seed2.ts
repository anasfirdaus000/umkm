import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete all records to start fresh (cascading deletes due to Prisma relations or direct deletion)
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.customService.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.video.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.image.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.size.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // 1. SETTINGS
  console.log('Seeding Settings...');
  await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {
      heroTitle: 'MORVA MODE INDONESIA',
      heroDesc: 'Menghadirkan produk jas hujan, cover motor, dan aksesoris outdoor kualitas premium dengan desain elegan untuk kenyamanan Anda.',
      address: 'Jakarta Selatan, Indonesia',
      whatsapp: '+62 813 7509 422',
      operationalHours: 'Senin - Jumat: 09:00 - 18:00\nSabtu: 09:00 - 15:00\nMinggu: Tutup',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      tiktok: 'https://tiktok.com',
      heroBgUrl1: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop',
      heroProductUrl: ''
    },
    create: {
      id: 'global',
      heroTitle: 'MORVA MODE INDONESIA',
      heroDesc: 'Menghadirkan produk jas hujan, cover motor, dan aksesoris outdoor kualitas premium dengan desain elegan untuk kenyamanan Anda.',
      address: 'Jakarta Selatan, Indonesia',
      whatsapp: '+62 813 7509 422',
      operationalHours: 'Senin - Jumat: 09:00 - 18:00\nSabtu: 09:00 - 15:00\nMinggu: Tutup',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      tiktok: 'https://tiktok.com',
      heroBgUrl1: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop',
      heroProductUrl: ''
    }
  });

  // 2. BRANDS (Mitra & Merk Terpercaya)
  console.log('Seeding Brands...');
  const brandLogos = [
    { name: "Brand 1", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 2", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 3", logoUrl: "https://images.unsplash.com/photo-1620288627228-56c1257406a4?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 4", logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 5", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 6", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 7", logoUrl: "https://images.unsplash.com/photo-1620288627228-56c1257406a4?q=80&w=200&auto=format&fit=crop" },
    { name: "Brand 8", logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop" },
  ];
  for (const b of brandLogos) {
    await prisma.brand.create({ data: b });
  }

  // 3. CATEGORIES
  console.log('Seeding Categories...');
  const catNames = ["Jas Hujan", "Cover Motor", "Best Seller", "Produk Baru", "Aksesoris"];
  for (const c of catNames) {
    await prisma.category.create({
      data: { name: c, description: `Kategori untuk ${c}` }
    });
  }

  // 4. PRODUCTS
  console.log('Seeding Products...');
  const productsData = [
    {
      name: "Jas Hujan Premium Original",
      category: "Jas Hujan",
      price: 250000,
      description: "Jas hujan premium dengan material tahan air 100%. Dilengkapi dengan seal di setiap jahitan sehingga air tidak akan merembes. Sangat cocok untuk pengendara motor jarak jauh.",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop"]
    },
    {
      name: "Cover Motor Anti Air",
      category: "Cover Motor",
      price: 150000,
      description: "Melindungi motor Anda dari hujan, debu, dan panas matahari. Dibuat dengan bahan parasut berkualitas yang ringan namun kuat.",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop"]
    },
    {
      name: "Jaket Outdoor Anti Angin",
      category: "Aksesoris",
      price: 350000,
      description: "Jaket yang dirancang khusus untuk menahan angin saat berkendara. Dilengkapi sirkulasi udara sehingga tidak panas saat dipakai siang hari.",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"]
    },
    {
      name: "Tas Ransel Waterproof",
      category: "Aksesoris",
      price: 280000,
      description: "Tas ransel dengan kapasitas besar dan material 100% waterproof. Cocok untuk menyimpan laptop dan dokumen penting saat cuaca tidak menentu.",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"]
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description,
        isFeatured: p.isFeatured,
        images: {
          create: p.images.map(url => ({ url, publicId: "dummy" }))
        },
        variants: {
          create: [{ name: "Standar" }]
        },
        sizes: {
          create: [{ name: "All Size" }]
        }
      }
    });
  }

  // 5. SERVICES
  console.log('Seeding Services...');
  const servicesData = [
    { title: "Produksi Massal (B2B)", description: "Layanan produksi jas hujan dan cover motor dalam skala besar untuk keperluan perusahaan atau event.", icon: "Package" },
    { title: "Desain Sesuai Keinginan", description: "Bisa custom warna, penambahan sablon logo, hingga penyesuaian ukuran khusus.", icon: "PenTool" },
    { title: "Material Premium", description: "Menggunakan bahan baku terpilih yang teruji ketahanan air dan anginnya.", icon: "ShieldCheck" },
    { title: "Garansi Kualitas", description: "Setiap produk melewati Quality Control ketat. Garansi retur jika ada cacat produksi.", icon: "Award" },
  ];
  for (const s of servicesData) {
    await prisma.customService.create({ data: s });
  }

  // 6. GALLERY
  console.log('Seeding Gallery...');
  const galleryImgs = [
    "https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1716807335126-54532f2ed0c3?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1684165610413-2401399e0e59?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614635884840-85cf80d23844?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?q=80&w=600&auto=format&fit=crop",
  ];
  for (const img of galleryImgs) {
    await prisma.gallery.create({ data: { imageUrl: img } });
  }

  // 7. VIDEO
  console.log('Seeding Video...');
  await prisma.video.create({
    data: {
      title: "Demonstrasi Ketahanan Air Jas Hujan Morva",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  });

  // 8. TESTIMONIALS
  console.log('Seeding Testimonials...');
  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Customer Custom Order",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
      content: "Sangat puas dengan jas hujan yang saya pesan. Bahannya tebal dan benar-benar tahan air. Top!",
      rating: 5
    },
    {
      name: "Siti Rahmawati",
      role: "Ibu Rumah Tangga",
      avatarUrl: "https://images.unsplash.com/photo-1616325629936-99a9013c29c6?q=80&w=200&auto=format&fit=crop",
      content: "Beli cover motor untuk melindungi motor di rumah, bahannya tebal dan ukurannya pas banget. Adminnya juga ramah banget di WhatsApp.",
      rating: 5
    },
    {
      name: "Andi Wijaya",
      role: "Pemilik Cafe",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop",
      content: "Order dalam jumlah lumayan banyak untuk tim lapangan saya, dapet diskon dan kualitasnya sangat memuaskan.",
      rating: 5
    },
    {
      name: "Dina Mariana",
      role: "Desainer Interior",
      avatarUrl: "https://images.unsplash.com/photo-1616325629936-99a9013c29c6?q=80&w=200&auto=format&fit=crop",
      content: "Kualitas produk premium ini setara dengan brand besar. Sangat direkomendasikan untuk kebutuhan outdoor dan berkendara.",
      rating: 5
    },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 9. FAQ
  console.log('Seeding FAQ...');
  const faqs = [
    {
      question: "Bagaimana cara melakukan pesanan custom?",
      answer: "Anda bisa langsung klik tombol 'Chat Custom Sekarang' atau icon WhatsApp di pojok kanan bawah. Kirimkan foto referensi desain dan ukuran yang diinginkan, tim kami akan membantu menghitung estimasi biaya."
    },
    {
      question: "Apakah harga sudah termasuk ongkos kirim?",
      answer: "Harga produk yang tertera belum termasuk ongkos kirim. Biaya pengiriman akan dihitung berdasarkan alamat tujuan dan volume barang via WhatsApp."
    },
    {
      question: "Berapa lama proses pembuatan produk pre-order?",
      answer: "Waktu pengerjaan standar adalah 7-14 hari kerja tergantung dari tingkat kesulitan dan antrean produksi. Kami akan selalu memberikan update progres kepada Anda."
    },
    {
      question: "Apakah bisa kirim ke luar kota/pulau?",
      answer: "Sangat bisa! Kami melayani pengiriman ke seluruh Indonesia menggunakan kargo terpercaya yang dilengkapi asuransi dan packing kayu yang aman."
    },
    {
      question: "Sistem pembayarannya seperti apa?",
      answer: "Untuk pesanan pre-order/custom, kami memberlakukan sistem DP 50% di awal. Sisa pembayaran dilakukan saat barang sudah jadi dan siap dikirim lengkap dengan foto dokumentasi dari tim kami."
    }
  ];
  for (const f of faqs) {
    await prisma.faq.create({ data: f });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
