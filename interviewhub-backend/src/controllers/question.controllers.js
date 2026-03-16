import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Question } from "../models/question.model.js";

const createQuestion = asyncHandler(async (req, res) => {
  const { title, description, difficulty, category, startingCode } = req.body;
  const question = await Question.findOne({ title });
  if (question) {
    throw new ApiError(400, "A question with this title already exists");
  }
  const newQuestion = await Question.create({
    title,
    description,
    difficulty,
    category,
    startingCode,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, newQuestion, "Question created"));
});

const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find().select("title difficulty category");
  return res.status(200).json(new ApiResponse(200, questions, "All questions"));
});

export { createQuestion, getAllQuestions };
