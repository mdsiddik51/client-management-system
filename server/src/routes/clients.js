import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
} from '../controllers/clientController.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin-only stats
router.get('/stats', authorize('ADMIN'), getClientStats);

// List & create
router.get('/', getClients);
router.post('/', authorize('ADMIN'), createClient);

// Single record
router.get('/:id', getClient);
router.put('/:id', authorize('ADMIN'), updateClient);
router.delete('/:id', authorize('ADMIN'), deleteClient);

export default router;
