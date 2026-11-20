import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', authorize('ADMIN'), createTask);

router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', authorize('ADMIN'), deleteTask);

export default router;
