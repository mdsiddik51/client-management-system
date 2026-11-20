import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { uploadSingle } from '../middleware/upload.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();

router.post('/image', authenticate, uploadSingle, uploadImage);

export default router;
