import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/users.models.js";
import { Question } from "./models/question.model.js";
import { Interview } from "./models/interview.models.js";

dotenv.config({ path: "./.env" });

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Connected Successfully! 🌱");

    console.log("Clearing old data...");
    await User.deleteMany({});
    await Question.deleteMany({});
    await Interview.deleteMany({});

    console.log("Creating Admin User...");
    await User.create({
      username: "admin_vasu",
      email: "admin@interviewhub.com",
      password: "securepassword123",
      role: "Admin",
    });

    console.log("Creating Coding Questions...");
    await Question.insertMany([
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        category: ["Arrays", "Hash Table"],
        startingCode:
          "function twoSum(nums, target) {\n  // Write your solution here\n}",
      },
      {
        title: "Reverse a String",
        description:
          "Write a function that reverses a string. The input string is given as an array of characters s.",
        difficulty: "Easy",
        category: ["Strings", "Two Pointers"],
        startingCode:
          "function reverseString(s) {\n  // Write your solution here\n}",
      },
      {
        title: "Merge Intervals",
        description:
          "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        difficulty: "Medium",
        category: ["Arrays", "Sorting"],
        startingCode:
          "function merge(intervals) {\n  // Write your solution here\n}",
      },
    ]);

    console.log("✅ Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};
seedDatabase();
