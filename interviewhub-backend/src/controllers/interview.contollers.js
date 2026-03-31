import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Interview } from "../models/interview.models.js";
import { Question } from "../models/question.model.js";
import crypto from "crypto";

const createInterview = asyncHandler(async (req, res) => {
  const { candidateName, questionIds } = req.body;
  if (!candidateName) {
    throw new ApiError(400, "Candidate name must be present");
  }
  if (!questionIds || questionIds.length == 0) {
    throw new ApiError(400, "Select alteast one question");
  }
  const questions = await Question.find({ _id: { $in: questionIds } });
  if (questions.length == 0) {
    throw new ApiError(400, "Questions not found");
  }
  const roomId = crypto.randomUUID();
  const interview = await Interview.create({
    roomId,
    interviewerId: req.user._id,
    candidateName,
    questions,
  });
  return res.status(201).json(new ApiResponse(201, interview, "room is live"));
});

const getInterviewByRoomId = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;
  const liveRoom = await Interview.findOne({ roomId });
  if (!liveRoom) {
    throw new ApiError(404, "Not found");
  }
  return res.status(200).json(new ApiResponse(200, liveRoom, "Here you go"));
});

const submitAnswer = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { questionId, finalCode } = req.body;
  const liveRoom = await Interview.findOne({ roomId });
  if (!liveRoom) {
    throw new ApiError(404, "Room not found");
  }
  const targetQuestion = liveRoom.questions.find((q) => {
    return q._id.toString() === questionId;
  });
  if (!targetQuestion) {
    throw new ApiError(404, "Question does not exist");
  }
  targetQuestion.finalCode = finalCode;
  await liveRoom.save();
  return res
    .status(200)
    .json(new ApiResponse(200, liveRoom, "Answer saved successfully"));
});

export { createInterview, getInterviewByRoomId, submitAnswer };
