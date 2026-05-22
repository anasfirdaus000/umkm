import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'morva-mode',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    };
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'morva-mode/videos',
      resource_type: 'video',
      allowed_formats: ['mp4', 'webm', 'mov'],
    };
  },
});

export const upload = multer({ storage: storage });
export const uploadVideo = multer({ storage: videoStorage });
