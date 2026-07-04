import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";

const createTeamSchema = z.object({
  name: z.string().min(2).max(30),
});

const addPlayerSchema = z.object({
  playerId: z.string(),
  isCaptain: z.boolean().optional(),
});

export const createFantasyTeam = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = createTeamSchema.parse(req.body);
  const team = await prisma.fantasyTeam.create({
    data: { userId: req.userId!, name: data.name },
  });
  res.status(201).json({ team });
});

export const myFantasyTeams = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const teams = await prisma.fantasyTeam.findMany({
    where: { userId: req.userId },
    include: { players: { include: { player: true } } },
  });
  res.json({ teams });
});

export const addFantasyPlayer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = addPlayerSchema.parse(req.body);
  const team = await prisma.fantasyTeam.findFirst({
    where: { id: req.params.teamId, userId: req.userId },
  });
  if (!team) return res.status(404).json({ error: "Fantasy team not found" });

  const link = await prisma.fantasyTeamPlayer.create({
    data: { fantasyTeamId: team.id, playerId: data.playerId, isCaptain: data.isCaptain ?? false },
  });
  res.status(201).json({ link });
});
