import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as teamController from "../controllers/team.controller";

const router = Router();
router.use(authMiddleware);
router.post("/", teamController.createTeam);
router.get('/:teamId', teamController.getTeamDetails as any);
router.post('/:teamId/add-user', teamController.addUserToTeam as any);
router.delete('/:teamId/remove-user', teamController.removeUserFromTeam as any);
router.delete('/:teamId', teamController.deleteTeam as any);
export default router;