import { Router } from "express";
import CheckinController from "../controllers/CheckinController.js";
import authMiddleware from "../middlewares/auth.js";


console.log('Arquivo checkinRoutes.js foi carregado.');

const router = new Router();

router.use(authMiddleware);
// POST
// router.post("/gyms/:gymId/checkins", CheckinController.create);

// GET
router.get("/checkins", CheckinController.index);

export default router;
