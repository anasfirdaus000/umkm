import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', register); // Sebaiknya ini di-disable di production agar orang lain tidak bisa register

export default router;
