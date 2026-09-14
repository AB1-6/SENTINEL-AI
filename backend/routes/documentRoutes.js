import { Router } from 'express';
import { deleteDocument, getDocuments, uploadDocument } from '../controllers/documentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/upload', requireAuth, upload.single('file'), uploadDocument);
router.get('/', requireAuth, getDocuments);
router.delete('/:id', requireAuth, deleteDocument);

export default router;