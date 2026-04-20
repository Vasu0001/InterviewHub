import mongoose, { Schema } from "mongoose";

const testCaseSchema = new Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startingCode: {
    type: String,
    default: "// Write your code here",
  },
  finalCode: {
    type: String,
    default: "",
  },
  testCases: [testCaseSchema],
});

const interviewSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    candidateName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Active", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    questions: [questionSchema],
    feedback: {
      problemSolving: { type: Number, min: 1, max: 5, default: null },
      codeQuality: { type: Number, min: 1, max: 5, default: null },
      communication: { type: Number, min: 1, max: 5, default: null },
      overall: { type: Number, min: 1, max: 5, default: null },
      notes: { type: String, default: "" },
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Interview = mongoose.model("Interview", interviewSchema);
