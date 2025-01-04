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

const postsRouter = Router();

postsRouter.get("/", authenticateJWT, getPosts);
postsRouter.post("/", authenticateJWT, authorizeAdmin, createPost);
postsRouter.put("/", authenticateJWT, authorizeAdmin, updatePost);
postsRouter.delete("/", authenticateJWT, authorizeAdmin, deletePost);

export default postsRouter;
