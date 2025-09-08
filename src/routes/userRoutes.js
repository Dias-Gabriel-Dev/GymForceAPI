import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from '../middlewares/auth.js';

const router = new Router();

// Rotas públicas GET, POST, PUT, DELETE
router.post("/users", UserController.create);

// Rotas protegidas
router.use(authMiddleware);

router.get('/user', UserController.show);

router.put('/user', UserController.update);

router.delete('/user', UserController.delete);

export default router;
