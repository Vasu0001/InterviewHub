import { Router } from "express";
import { runCodeLocally } from "../controllers/execute.controllers.js";

const router = Router();
router.post("/", runCodeLocally);

export default router;
