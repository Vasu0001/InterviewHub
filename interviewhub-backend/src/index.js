import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "request coming",
  });
});

app.listen(3000, () => {
  console.log("Server is running on " + 3000);
});
