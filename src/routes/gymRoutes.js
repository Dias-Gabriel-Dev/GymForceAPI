import { Router } from "express";
import GymController from "../controllers/GymController.js";
import CheckinController from "../controllers/CheckinController.js";
import authMiddleware from "../middlewares/auth.js";

const router = new Router();

router.post('/gyms', GymController.create);
router.post('/gyms/:gymId/checkins', authMiddleware, CheckinController.create);

export default router;
