import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// GENERIC CRUD HELPER FOR CMS
export const getAll = (modelName: string) => async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const data = await prisma[modelName].findMany({ orderBy: { createdAt: 'desc' } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${modelName}` });
  }
};

export const createItem = (modelName: string, imageField?: string) => async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    const file = req.file as Express.Multer.File;
    
    if (file && imageField) {
      data[imageField] = file.path;
      data.publicId = file.filename;
    }

    // Convert string 'true'/'false' to boolean if needed for specific fields
    // Not strictly needed if sending clean JSON, but good for FormData
    
    // @ts-ignore
    const newItem = await prisma[modelName].create({ data });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error creating ${modelName}` });
  }
};

export const updateItem = (modelName: string, imageField?: string) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const file = req.file as Express.Multer.File;

    if (file && imageField) {
      data[imageField] = file.path;
      // You should delete old image from cloudinary here if you want to be perfect
      // But for simplicity in this V1 CMS we'll just overwrite the URL in DB
    }

    // @ts-ignore
    const updated = await prisma[modelName].update({ where: { id }, data });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: `Error updating ${modelName}` });
  }
};

export const deleteItem = (modelName: string, hasImage?: boolean) => async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (hasImage) {
      // @ts-ignore
      const item = await prisma[modelName].findUnique({ where: { id } });
      if (item?.publicId) {
        await cloudinary.uploader.destroy(item.publicId);
      }
    }

    // @ts-ignore
    await prisma[modelName].delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${modelName}` });
  }
};
