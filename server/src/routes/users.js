import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  listUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getProfile,
  updateProfile,
} from '../controllers/userController.js';

const router = Router();

router.use(authenticate);

// Profile routes (any authenticated user)
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Admin-only user management
router.get('/', authorize('ADMIN'), listUsers);
router.get('/:id', authorize('ADMIN'), getUser);
router.patch('/:id/role', authorize('ADMIN'), updateUserRole);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
