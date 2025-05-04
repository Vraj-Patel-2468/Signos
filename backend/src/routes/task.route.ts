import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as taskController from "../controllers/task.controller";

const router = Router();
router.use(authMiddleware);

router.post("/", taskController.createTask as any);
router.get("/:taskId", taskController.getTaskDetails as any);
router.put("/:taskId", taskController.updateTask as any);
router.delete("/:taskId", taskController.deleteTask as any);
router.post("/:taskId/dependencies", taskController.addTaskDependency as any);
router.delete("/:taskId/dependencies/:dependencyId", taskController.removeTaskDependency as any);

export default router;