import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createInterview,
  getInterviewByRoomId,
  submitAnswer,
} from "../controllers/interview.contollers.js";

const router = Router();

router.route("/").post(jwtVerify, createInterview);
router.route("/:roomId").get(getInterviewByRoomId);
router.route("/:roomId/submit").post(submitAnswer);

export default router;
