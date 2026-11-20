import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', authorize('ADMIN'), createProject);

router.get('/:id', getProject);
router.put('/:id', authorize('ADMIN'), updateProject);
router.delete('/:id', authorize('ADMIN'), deleteProject);

export default router;
