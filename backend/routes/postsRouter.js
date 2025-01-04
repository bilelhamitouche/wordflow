import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/postController.js";
import {
  authenticateJWT,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";
import commentsRouter from "./commentsRouter.js";

const postsRouter = Router();

postsRouter.use("/:postId/comments", commentsRouter);
postsRouter.get("/", authenticateJWT, getPosts);
postsRouter.post("/", authenticateJWT, authorizeAdmin, createPost);
postsRouter.put("/:postId", authenticateJWT, authorizeAdmin, updatePost);
postsRouter.delete("/:postId", authenticateJWT, authorizeAdmin, deletePost);

export default postsRouter;
