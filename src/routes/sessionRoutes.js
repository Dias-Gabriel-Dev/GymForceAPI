import { Router } from "express";
import SessionController from "../controllers/SessionController.js";

const router = new Router();

router.post("/sessions", SessionController.create);

export default router;
