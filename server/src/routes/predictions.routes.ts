import { Router } from "express";
import { myPredictions, upsertPrediction } from "../controllers/predictions.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/mine", myPredictions);
router.post("/", upsertPrediction);

export default router;
