import { Router } from 'express';
import { deleteHistory, exportHistory, getHistory, renameHistory, sendChat } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, sendChat);
router.get('/history', requireAuth, getHistory);
router.get('/history/export', requireAuth, exportHistory);
router.delete('/history/:id', requireAuth, deleteHistory);
router.put('/history/:id', requireAuth, renameHistory);

export default router;