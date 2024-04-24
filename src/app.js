import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import blogRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";
import userInteractionRouter from "./routes/userInteraction.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
//Authentication routes
app.use("/blog-ger", authRouter);
//User routes
app.use("/blog-ger/profile", profileRouter);
//Blog routes & comment - create & get
app.use("/blog-ger/post", blogRouter);
//comments - update & delete
app.use("/blog-ger/comment", commentRouter);
//user - following & followedBy
app.use("/blog-ger/user/:id", userInteractionRouter);

export { app };
