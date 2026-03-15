import { Router } from "express";
import {
  userRegisterValidator,
  userLogInValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLogInValidator(), validate, loginUser);
export default router;
