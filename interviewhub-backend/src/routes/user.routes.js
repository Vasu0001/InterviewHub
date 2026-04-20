import { Router } from "express";
import {
  userRegisterValidator,
  userLogInValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  changeCurrentPassword,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLogInValidator(), validate, loginUser);

router.route("/current-user").get(jwtVerify, getCurrentUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/change-password").post(jwtVerify, changeCurrentPassword);
export default router;
