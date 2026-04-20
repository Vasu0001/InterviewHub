import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import questionRouter from "./routes/question.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import executeRouter from "./routes/execute.routes.js";

const app = express();

app.use(express.json({ limit: "16Kb" }));
app.use(express.urlencoded({ extended: true, limit: "16Kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
  }),
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/interviews", interviewRouter);
app.use("/api/v1/execute", executeRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "request coming",
  });
});

export default app;
