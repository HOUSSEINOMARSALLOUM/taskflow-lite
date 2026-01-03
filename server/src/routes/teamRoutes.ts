import express from "express";
import * as teamController from "../controllers/teamController";
import { authenticate } from "../utils/jwt";

const router = express.Router();

router.use(authenticate);

router.post("/", teamController.createTeam);
router.get("/", teamController.getUserTeams);
router.get("/:teamId", teamController.getTeamById);
router.post("/:teamId/members", teamController.addTeamMember);

export default router;
