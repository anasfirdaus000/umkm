import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// INITIALIZE SETTINGS IF NOT EXIST
const initSettings = async () => {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: 'global' }
    });
  }
  return settings;
};

// GET SETTINGS (Public)
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await initSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// UPDATE SETTINGS (Admin)
export const updateSettings = async (req: Request, res: Response) => {
  try {
    await initSettings(); // ensure it exists

    const data = { ...req.body };
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.heroBg1?.[0]) data.heroBgUrl1 = files.heroBg1[0].path;
    if (files?.heroBg2?.[0]) data.heroBgUrl2 = files.heroBg2[0].path;
    if (files?.heroBg3?.[0]) data.heroBgUrl3 = files.heroBg3[0].path;
    if (files?.heroBg4?.[0]) data.heroBgUrl4 = files.heroBg4[0].path;
    if (files?.heroProduct?.[0]) data.heroProductUrl = files.heroProduct[0].path;
    if (files?.logo?.[0]) data.logoUrl = files.logo[0].path;

    // clean up undefined/null values so Prisma doesn't complain about updating with undefined
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: 'global' },
      data: data
    });

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};
