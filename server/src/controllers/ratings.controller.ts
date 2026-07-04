import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

const rateSchema = z.object({
  playerId: z.string(),
  matchId: z.string(),
  rating: z.number().min(1).max(10),
});

export const ratePlayer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = rateSchema.parse(req.body);
  const rating = await prisma.playerRating.upsert({
    where: {
      userId_playerId_matchId: { userId: req.userId!, playerId: data.playerId, matchId: data.matchId },
    },
    update: { rating: data.rating },
    create: { userId: req.userId!, ...data },
  });
  res.json({ rating });
});

export const matchRatings = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const ratings = await prisma.playerRating.groupBy({
    by: ["playerId"],
    where: { matchId: req.params.matchId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  res.json({ ratings });
});
