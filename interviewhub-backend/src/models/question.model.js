import mongoose, { Schema } from "mongoose";

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
  },
  {
    timestamps: true,
  },
);

export const Question = mongoose.model("Question", questionSchema);
