import mongoose, { Schema } from "mongoose";

const testCaseSchema = new Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: [
      {
        type: String,
        trim: true,
      },
    ],
    startingCode: {
      type: String,
      default: "// Write your solution here",
    },
    testCases: [testCaseSchema],
  },
  {
    timestamps: true,
  },
);

export const Question = mongoose.model("Question", questionSchema);
