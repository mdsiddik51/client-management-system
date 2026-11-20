import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { getDashboardStats } from '../controllers/analyticsController.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('ADMIN'), getDashboardStats);

export default router;
