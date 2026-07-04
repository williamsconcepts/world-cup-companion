import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";
import { getIO } from "../sockets";

const postSchema = z.object({
  title: z.string().min(2).max(120),
  body: z.string().min(1).max(5000),
  matchId: z.string().optional(),
});

const commentSchema = z.object({
  body: z.string().min(1).max(2000),
});

export const listPosts = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const posts = await prisma.discussionPost.findMany({
    where: { matchId: req.query.matchId ? String(req.query.matchId) : undefined },
    include: { user: { select: { username: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ posts });
});

export const createPost = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = postSchema.parse(req.body);
  const post = await prisma.discussionPost.create({
    data: { ...data, userId: req.userId! },
    include: { user: { select: { username: true } } },
  });
  getIO().to(post.matchId ? `match:${post.matchId}` : "global").emit("discussion:new-post", post);
  res.status(201).json({ post });
});

export const addComment = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = commentSchema.parse(req.body);
  const comment = await prisma.discussionComment.create({
    data: { body: data.body, postId: req.params.postId, userId: req.userId! },
    include: { user: { select: { username: true } } },
  });
  getIO().to(`post:${req.params.postId}`).emit("discussion:new-comment", comment);
  res.status(201).json({ comment });
});
