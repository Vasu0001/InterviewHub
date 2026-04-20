import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createInterview,
  getInterviewByRoomId,
  submitAnswer,
  submitFeedback,
  getInterviewsHistory,
} from "../controllers/interview.contollers.js";

const router = Router();

router.route("/").post(jwtVerify, createInterview);
router.route("/history").get(jwtVerify, getInterviewsHistory);
router.route("/:roomId").get(getInterviewByRoomId);
router.route("/:roomId/submit").post(submitAnswer);
router.route("/:roomId/feedback").patch(jwtVerify, submitFeedback);

export default router;
