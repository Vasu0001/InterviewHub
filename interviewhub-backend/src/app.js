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

const allowedOrigins = [
  process.env.FRONTEND_URL, 
  process.env.CORS_ORIGIN,
  "https://interview-hub-five.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);
      
      
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
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
    message: "request coming",
  });
});

export default app;
