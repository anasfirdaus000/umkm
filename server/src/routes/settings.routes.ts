import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, upload.fields([
  { name: 'heroBg1', maxCount: 1 },
  { name: 'heroBg2', maxCount: 1 },
  { name: 'heroBg3', maxCount: 1 },
  { name: 'heroBg4', maxCount: 1 },
  { name: 'heroProduct', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), updateSettings);

export default router;
