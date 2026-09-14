import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Sentinel AI 2.0 backend running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap backend', error);
  process.exit(1);
});