import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as projectController from "../controllers/project.controller";

const router = Router();
router.use(authMiddleware);

router.post("/", projectController.createProject as any);
router.get("/:projectId", projectController.getProjectDetails as any);
router.delete("/:projectId", projectController.deleteProject as any);

export default router;
