import { Router } from 'express';
import { predictPrompt } from '../controllers/mlController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/predict', requireAuth, predictPrompt);

export default router;