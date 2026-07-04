import { Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

export const getLeaderboard = asyncHandler(async (_req: AuthedRequest, res: Response) => {
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: { totalPoints: "desc" },
    take: 100,
    include: { user: { select: { username: true, avatarUrl: true } } },
  });
  res.json({ entries });
});
