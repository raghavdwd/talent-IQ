import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:sessionId", protectRoute, getSessionById);
router.post("/:sessionId/join", protectRoute, joinSession);
router.post("/:sessionId/complete", protectRoute, completeSession);

export default router;
