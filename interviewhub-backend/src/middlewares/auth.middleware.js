import { User } from "../models/users.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const jwtVerify = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry -__v",
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid access token");
  }
});

export const isInterviewer = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.role) {
    throw new ApiError(401, "Unauthorized request");
  }
  if (req.user.role !== "Interviewer") {
    throw new ApiError(403, "you don't have permission to be here");
  }
  next();
});
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.role) {
    throw new ApiError(401, "Unauthorized request");
  }
  if (req.user.role !== "Admin") {
    throw new ApiError(403, "you don't have permission to be here");
  }
  next();
});
