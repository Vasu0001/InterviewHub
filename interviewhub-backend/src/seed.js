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

    console.log("Creating Coding Questions with Test Cases...");
    const questions = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "Easy",
        category: ["Arrays", "Hash Table"],
        startingCode:
          "function twoSum(nums, target) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
          { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
        ],
      },
      {
        title: "Reverse a String",
        description:
          "Write a function that reverses a string. The input string is given as an array of characters s.",
        difficulty: "Easy",
        category: ["Strings", "Two Pointers"],
        startingCode:
          "function reverseString(s) {\n  // Write your solution here\n}",
        testCases: [
          {
            input: "s = ['h','e','l','l','o']",
            expectedOutput: "['o','l','l','e','h']",
          },
          {
            input: "s = ['H','a','n','n','a','h']",
            expectedOutput: "['h','a','n','n','a','H']",
          },
        ],
      },
      {
        title: "Valid Palindrome",
        description:
          "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        difficulty: "Easy",
        category: ["Strings", "Two Pointers"],
        startingCode:
          "function isPalindrome(s) {\n  // Write your solution here\n}",
        testCases: [
          {
            input: 's = "A man, a plan, a canal: Panama"',
            expectedOutput: "true",
          },
          { input: 's = "race a car"', expectedOutput: "false" },
        ],
      },
      {
        title: "Contains Duplicate",
        description:
          "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        difficulty: "Easy",
        category: ["Arrays", "Hash Table"],
        startingCode:
          "function containsDuplicate(nums) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [1,2,3,1]", expectedOutput: "true" },
          { input: "nums = [1,2,3,4]", expectedOutput: "false" },
        ],
      },
      {
        title: "Valid Anagram",
        description:
          "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        difficulty: "Easy",
        category: ["Strings", "Sorting"],
        startingCode:
          "function isAnagram(s, t) {\n  // Write your solution here\n}",
        testCases: [
          { input: 's = "anagram", t = "nagaram"', expectedOutput: "true" },
          { input: 's = "rat", t = "car"', expectedOutput: "false" },
        ],
      },
      {
        title: "Missing Number",
        description:
          "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
        difficulty: "Easy",
        category: ["Arrays", "Math"],
        startingCode:
          "function missingNumber(nums) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [3,0,1]", expectedOutput: "2" },
          { input: "nums = [0,1]", expectedOutput: "2" },
        ],
      },
      {
        title: "Move Zeroes",
        description:
          "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
        difficulty: "Easy",
        category: ["Arrays", "Two Pointers"],
        startingCode:
          "function moveZeroes(nums) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [0,1,0,3,12]", expectedOutput: "[1,3,12,0,0]" },
          { input: "nums = [0]", expectedOutput: "[0]" },
        ],
      },

      {
        title: "Merge Intervals",
        description:
          "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        difficulty: "Medium",
        category: ["Arrays", "Sorting"],
        startingCode:
          "function merge(intervals) {\n  // Write your solution here\n}",
        testCases: [
          {
            input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
            expectedOutput: "[[1,6],[8,10],[15,18]]",
          },
          { input: "intervals = [[1,4],[4,5]]", expectedOutput: "[[1,5]]" },
        ],
      },
      {
        title: "Product of Array Except Self",
        description:
          "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
        difficulty: "Medium",
        category: ["Arrays", "Prefix Sum"],
        startingCode:
          "function productExceptSelf(nums) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [1,2,3,4]", expectedOutput: "[24,12,8,6]" },
          { input: "nums = [-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" },
        ],
      },
      {
        title: "Maximum Subarray",
        description:
          "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
        difficulty: "Medium",
        category: ["Arrays", "Dynamic Programming"],
        startingCode:
          "function maxSubArray(nums) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
          { input: "nums = [1]", expectedOutput: "1" },
        ],
      },
      {
        title: "Coin Change",
        description:
          "Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
        difficulty: "Medium",
        category: ["Dynamic Programming", "Breadth-First Search"],
        startingCode:
          "function coinChange(coins, amount) {\n  // Write your solution here\n}",
        testCases: [
          { input: "coins = [1,2,5], amount = 11", expectedOutput: "3" },
          { input: "coins = [2], amount = 3", expectedOutput: "-1" },
        ],
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description:
          "Given a string s, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        category: ["Strings", "Sliding Window"],
        startingCode:
          "function lengthOfLongestSubstring(s) {\n  // Write your solution here\n}",
        testCases: [
          { input: 's = "abcabcbb"', expectedOutput: "3" },
          { input: 's = "bbbbb"', expectedOutput: "1" },
        ],
      },
      {
        title: "Container With Most Water",
        description:
          "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        difficulty: "Medium",
        category: ["Arrays", "Two Pointers"],
        startingCode:
          "function maxArea(height) {\n  // Write your solution here\n}",
        testCases: [
          { input: "height = [1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
          { input: "height = [1,1]", expectedOutput: "1" },
        ],
      },
      {
        title: "Top K Frequent Elements",
        description:
          "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
        difficulty: "Medium",
        category: ["Arrays", "Hash Table", "Heap"],
        startingCode:
          "function topKFrequent(nums, k) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums = [1,1,1,2,2,3], k = 2", expectedOutput: "[1,2]" },
          { input: "nums = [1], k = 1", expectedOutput: "[1]" },
        ],
      },

      {
        title: "Trapping Rain Water",
        description:
          "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        difficulty: "Hard",
        category: ["Arrays", "Two Pointers"],
        startingCode:
          "function trap(height) {\n  // Write your solution here\n}",
        testCases: [
          { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
          { input: "height = [4,2,0,3,2,5]", expectedOutput: "9" },
        ],
      },
      {
        title: "Merge k Sorted Lists",
        description:
          "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        difficulty: "Hard",
        category: ["Linked List", "Divide and Conquer", "Heap"],
        startingCode:
          "function mergeKLists(lists) {\n  // Write your solution here\n}",
        testCases: [
          {
            input: "lists = [[1,4,5],[1,3,4],[2,6]]",
            expectedOutput: "[1,1,2,3,4,4,5,6]",
          },
          { input: "lists = []", expectedOutput: "[]" },
        ],
      },
      {
        title: "Longest Valid Parentheses",
        description:
          "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
        difficulty: "Hard",
        category: ["Strings", "Dynamic Programming", "Stack"],
        startingCode:
          "function longestValidParentheses(s) {\n  // Write your solution here\n}",
        testCases: [
          { input: 's = "(()"', expectedOutput: "2" },
          { input: 's = ")()())"', expectedOutput: "4" },
        ],
      },
      {
        title: "Word Search II",
        description:
          "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells.",
        difficulty: "Hard",
        category: ["Backtracking", "Trie"],
        startingCode:
          "function findWords(board, words) {\n  // Write your solution here\n}",
        testCases: [
          {
            input:
              'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
            expectedOutput: '["eat","oath"]',
          },
        ],
      },
      {
        title: "Minimum Window Substring",
        description:
          "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
        difficulty: "Hard",
        category: ["Strings", "Sliding Window"],
        startingCode:
          "function minWindow(s, t) {\n  // Write your solution here\n}",
        testCases: [
          { input: 's = "ADOBECODEBANC", t = "ABC"', expectedOutput: '"BANC"' },
          { input: 's = "a", t = "a"', expectedOutput: '"a"' },
        ],
      },
      {
        title: "Median of Two Sorted Arrays",
        description:
          "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        difficulty: "Hard",
        category: ["Arrays", "Binary Search"],
        startingCode:
          "function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n}",
        testCases: [
          { input: "nums1 = [1,3], nums2 = [2]", expectedOutput: "2.00000" },
          { input: "nums1 = [1,2], nums2 = [3,4]", expectedOutput: "2.50000" },
        ],
      },
    ];

    await Question.insertMany(questions);

    console.log("✅ Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};
seedDatabase();
