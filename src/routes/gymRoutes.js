import { Router } from "express";
import GymController from "../controllers/GymController.js";
import CheckinController from "../controllers/CheckinController.js";
import authMiddleware from "../middlewares/auth.js";
import adminOnly from "../middlewares/adminOnly.js";

const router = new Router();

router.use(authMiddleware);

// Rotas para qualquer usuário
router.get('/gyms', GymController.index);
router.get('/gyms/search', GymController.search);
router.post('/gyms/:gymId/checkins', CheckinController.create);

// Rotas somente admin
router.post('/gyms', adminOnly, GymController.create);
router.put('/gyms/:id', adminOnly, GymController.update);
router.delete('/gyms/:id', adminOnly, GymController.delete);

export default router;