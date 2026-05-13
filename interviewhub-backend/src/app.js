import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import questionRouter from "./routes/question.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import executeRouter from "./routes/execute.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(express.json({ limit: "64Kb" }));
app.use(express.urlencoded({ extended: true, limit: "64Kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  "https://interview-hub-five.vercel.app",
  "http://localhost:5173",
]
  .flatMap((origin) => origin?.split(",") || [])
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes("*")) return true;
  if (configuredOrigins.includes(origin)) return true;
  return /^https:\/\/[a-z0-9-]+(-[a-z0-9-]+)*\.vercel\.app$/i.test(origin);
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/interviews", interviewRouter);
app.use("/api/v1/execute", executeRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "InterviewHub API is running",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
