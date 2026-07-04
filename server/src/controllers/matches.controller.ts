import { Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

export const listMatches = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { status, stage } = req.query;
  const matches = await prisma.match.findMany({
    where: {
      status: status ? (status as any) : undefined,
      stage: stage ? String(stage) : undefined,
    },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { kickoffAt: "asc" },
  });
  res.json({ matches });
});

export const getMatch = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const match = await prisma.match.findUnique({
    where: { id: req.params.id },
    include: { homeTeam: true, awayTeam: true },
  });
  if (!match) return res.status(404).json({ error: "Match not found" });
  res.json({ match });
});
