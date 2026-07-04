import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

const predictSchema = z.object({
  matchId: z.string(),
  predHomeScore: z.number().int().min(0),
  predAwayScore: z.number().int().min(0),
});

export const upsertPrediction = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = predictSchema.parse(req.body);
  const match = await prisma.match.findUnique({ where: { id: data.matchId } });
  if (!match) return res.status(404).json({ error: "Match not found" });
  if (match.status !== "SCHEDULED") {
    return res.status(400).json({ error: "Predictions lock once a match has kicked off" });
  }

  const prediction = await prisma.prediction.upsert({
    where: { userId_matchId: { userId: req.userId!, matchId: data.matchId } },
    update: { predHomeScore: data.predHomeScore, predAwayScore: data.predAwayScore },
    create: { userId: req.userId!, ...data },
  });
  res.json({ prediction });
});

export const myPredictions = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const predictions = await prisma.prediction.findMany({
    where: { userId: req.userId },
    include: { match: { include: { homeTeam: true, awayTeam: true } } },
  });
  res.json({ predictions });
});
