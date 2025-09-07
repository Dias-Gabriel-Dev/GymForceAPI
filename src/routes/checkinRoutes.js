import { Router } from 'express';
import CheckinController from '../controllers/CheckinController.js';
import authMiddleware from '../middlewares/auth.js';

const router = new Router();

router.use(authMiddleware);

router.post('/checkins', CheckinController.create);

export default router;