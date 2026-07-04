import { Router } from "express";
import { matchRatings, ratePlayer } from "../controllers/ratings.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/match/:matchId", matchRatings);
router.post("/", requireAuth, ratePlayer);

export default router;
