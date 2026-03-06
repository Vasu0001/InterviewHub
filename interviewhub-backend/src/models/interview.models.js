import mongoose, { Schema } from "mongoose";

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
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      notes: {
        type: String,
        default: "",
      },
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
