import { Router } from 'express';
import { getAllProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Protected Admin Routes
router.post('/', authenticateToken, upload.array('images', 5), createProduct);
router.put('/:id', authenticateToken, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
