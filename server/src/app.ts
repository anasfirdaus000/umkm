import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import settingsRoutes from './routes/settings.routes';
import cmsRoutes from './routes/cms.routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/cms', cmsRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Morva Mode API' });
});

export default app;
