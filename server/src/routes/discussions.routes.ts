import { Router } from "express";
import { addComment, createPost, listPosts } from "../controllers/discussions.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/", listPosts);
router.post("/", requireAuth, createPost);
router.post("/:postId/comments", requireAuth, addComment);

export default router;
