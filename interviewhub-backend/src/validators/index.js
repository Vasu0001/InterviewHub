import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password")
      .if(body("authProvider").not().equals("google"))
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("fullName").optional().trim(),
  ];
};

const userLogInValidator = () => {
  return [
    body("username").optional().trim(),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Must be a valid email"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};

const createQuestionValidator = () => {
  return [
    body("title").notEmpty().withMessage("title is required").trim(),
    body("description")
      .notEmpty()
      .withMessage("description is required")
      .trim(),
    body("difficulty")
      .notEmpty()
      .withMessage("difficulty is required")
      .isIn(["Easy", "Medium", "Hard"])
      .withMessage("Diffculty must be Easy, Medium, or Hard"),
    body("category").optional().isArray().withMessage("Array is required"),
    body("startingCode").optional().trim(),
  ];
};

export { userRegisterValidator, userLogInValidator, createQuestionValidator };
