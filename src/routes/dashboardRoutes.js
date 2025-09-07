import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';

const router = new Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: `Bem-vindo ao dashboard!`,
    user: req.userId
  });
});

export default router;