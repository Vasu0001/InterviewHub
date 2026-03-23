import { Router } from "express";
import { isAdmin, jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
} from "../controllers/question.controllers.js";

const router = Router();

router.route("/").post(jwtVerify, isAdmin, createQuestion);
router.route("/").get(jwtVerify, getAllQuestions);
router.route("/:questionId").get(jwtVerify, getQuestionById);

export default router;
