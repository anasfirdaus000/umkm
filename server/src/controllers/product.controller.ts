import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// GET ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true, sizes: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// GET FEATURED PRODUCTS
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { images: true, variants: true, sizes: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products' });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, sizes: true }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// CREATE PRODUCT (Admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, description, isFeatured, variants, sizes } = req.body;
    const files = req.files as Express.Multer.File[];

    // Parse stringified arrays if sent via FormData
    const parsedVariants = variants ? (typeof variants === 'string' ? JSON.parse(variants) : variants) : [];
    const parsedSizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [];
    const parsedIsFeatured = isFeatured === 'true' || isFeatured === true;

      const newProduct = await prisma.product.create({
      data: {
        name: name as string,
        category: category as string,
        price: parseInt(price as string),
        description: description as string,
        isFeatured: parsedIsFeatured,
        variants: {
          create: parsedVariants.map((v: string) => ({ name: v }))
        },
        sizes: {
          create: parsedSizes.map((s: string) => ({ name: s }))
        },
        images: {
          create: files?.map(f => ({
            url: f.path,
            publicId: f.filename
          })) || []
        }
      },
      include: { images: true, variants: true, sizes: true }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// UPDATE PRODUCT (Admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, category, price, description, isFeatured, variants, sizes, keptImages } = req.body;
    const files = req.files as Express.Multer.File[];

    const parsedVariants = variants ? (typeof variants === 'string' ? JSON.parse(variants) : variants) : [];
    const parsedSizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [];
    const parsedIsFeatured = isFeatured === 'true' || isFeatured === true;
    const parsedKeptImages = keptImages ? (typeof keptImages === 'string' ? JSON.parse(keptImages) : keptImages) : [];

    // Delete old images not in keptImages
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true } as any
    });

    if (product) {
      const existingImages: any[] = (product as any).images || [];
      const imagesToDelete = existingImages.filter(img => !parsedKeptImages.includes(img.id));
      
      for (const img of imagesToDelete) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
        await prisma.image.delete({ where: { id: img.id } });
      }
    }

    // Delete existing variants and sizes to recreate them
    await prisma.variant.deleteMany({ where: { productId: id } });
    await prisma.size.deleteMany({ where: { productId: id } });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name as string,
        category: category as string,
        price: parseInt(price as string),
        description: description as string,
        isFeatured: parsedIsFeatured,
        variants: {
          create: parsedVariants.map((v: string) => ({ name: v }))
        },
        sizes: {
          create: parsedSizes.map((s: string) => ({ name: s }))
        },
        images: {
          create: files?.map(f => ({
            url: f.path,
            publicId: f.filename
          })) || []
        }
      },
      include: { images: true, variants: true, sizes: true }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// DELETE PRODUCT (Admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Ambil gambar untuk dihapus dari Cloudinary
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true } as any
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Hapus file di Cloudinary
    const images: any[] = (product as any).images || [];
    for (const image of images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
