import { Router } from "express";
import {
  createComment,
  getComments,
} from "../controllers/commentController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/", authenticateJWT, getComments);
commentsRouter.post("/", authenticateJWT, createComment);

export default commentsRouter;
