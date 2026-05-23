import app from './app';
import dotenv from 'dotenv';

dotenv.config();

// Vercel Serverless Function compatibility
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
