import { Router } from 'express';
import { getAll, createItem, updateItem, deleteItem } from '../controllers/cms.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { upload, uploadVideo } from '../middlewares/upload.middleware';

const router = Router();

// Helper to generate routes for a specific model
const generateRoutes = (modelName: string, imageField?: string) => {
  const r = Router();
  r.get('/', getAll(modelName));
  
  if (imageField) {
    r.post('/', authenticateToken, upload.single(imageField), createItem(modelName, imageField));
    r.put('/:id', authenticateToken, upload.single(imageField), updateItem(modelName, imageField));
    r.delete('/:id', authenticateToken, deleteItem(modelName, true));
  } else {
    r.post('/', authenticateToken, createItem(modelName));
    r.put('/:id', authenticateToken, updateItem(modelName));
    r.delete('/:id', authenticateToken, deleteItem(modelName, false));
  }
  
  return r;
};

router.use('/brands', generateRoutes('brand', 'logoUrl'));
router.use('/categories', generateRoutes('category'));

// Services uses imageUrl
router.use('/services', generateRoutes('customService', 'imageUrl'));

router.use('/galleries', generateRoutes('gallery', 'imageUrl'));

// Video route manually defined to use uploadVideo
const videoRouter = Router();
videoRouter.get('/', getAll('video'));
videoRouter.post('/', authenticateToken, uploadVideo.single('videoUrl'), createItem('video', 'videoUrl'));
videoRouter.put('/:id', authenticateToken, uploadVideo.single('videoUrl'), updateItem('video', 'videoUrl'));
videoRouter.delete('/:id', authenticateToken, deleteItem('video', true));
router.use('/videos', videoRouter);

router.use('/testimonials', generateRoutes('testimonial', 'avatarUrl'));
router.use('/faqs', generateRoutes('faq'));

export default router;
