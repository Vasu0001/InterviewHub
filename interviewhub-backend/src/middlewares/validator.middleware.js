import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-errors.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map((err) => {
    return { field: err.path, message: err.msg };
  });
  const firstErrorMessage = errors.array()[0].msg;

  return res.status(422).json({
    success: false,
    message: firstErrorMessage,
    errors: extractedErrors,
  });
};
