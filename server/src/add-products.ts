import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding 2 more products...');
  
  const productsData = [
    {
      name: "Sepatu Boots Outdoor Premium",
      category: "Aksesoris",
      price: 450000,
      description: "Sepatu boots tahan air untuk aktivitas outdoor dan berkendara di segala cuaca. Sangat tangguh dan nyaman dipakai.",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"]
    },
    {
      name: "Sarung Tangan Motor Kulit",
      category: "Aksesoris",
      price: 185000,
      description: "Sarung tangan motor berbahan kulit asli dengan pelindung knuckle. Grip maksimal di kondisi basah maupun kering.",
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1521579541575-103cb78fa81a?q=80&w=600&auto=format&fit=crop"]
    }
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
          create: [{ name: "Hitam" }]
        },
        sizes: {
          create: [{ name: "All Size" }]
        }
      }
    });
  }

  console.log('Successfully added 2 new products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
