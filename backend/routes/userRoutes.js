import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/rbacMiddleware.js';

const router = Router();

router.get('/', requireAuth, allowRoles('Super Administrator', 'Security Analyst'), getUsers);
router.post('/', requireAuth, allowRoles('Super Administrator'), createUser);
router.put('/:id', requireAuth, allowRoles('Super Administrator'), updateUser);
router.delete('/:id', requireAuth, allowRoles('Super Administrator'), deleteUser);

export default router;