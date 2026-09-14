import { Router } from 'express';
import { getSecurityAlerts, getSecurityLogs, getSecurityStatus } from '../controllers/securityController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/status', requireAuth, getSecurityStatus);
router.get('/logs', requireAuth, getSecurityLogs);
router.get('/alerts', requireAuth, getSecurityAlerts);

export default router;