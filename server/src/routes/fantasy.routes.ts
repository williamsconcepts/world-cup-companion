import { Router } from "express";
import { addFantasyPlayer, createFantasyTeam, myFantasyTeams } from "../controllers/fantasy.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", myFantasyTeams);
router.post("/", createFantasyTeam);
router.post("/:teamId/players", addFantasyPlayer);

export default router;
