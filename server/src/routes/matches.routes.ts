import { Router } from "express";
import { getMatch, listMatches } from "../controllers/matches.controller";

const router = Router();
router.get("/", listMatches);
router.get("/:id", getMatch);

export default router;
