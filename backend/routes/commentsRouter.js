import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/", authenticateJWT, getComments);
commentsRouter.post("/", authenticateJWT, createComment);
commentsRouter.patch("/:commentId", authenticateJWT, updateComment);
commentsRouter.delete("/:commentId", authenticateJWT, deleteComment);

export default commentsRouter;
