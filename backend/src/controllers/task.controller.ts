import { Request, Response } from "express";
import * as taskService from "../services/task.service";

export async function createTask(req: Request, res: Response) {
    const { title, description, status, priority, dueDate, assignedTo, projectId, remarks, rating } = req.body;
    const userId = req.body.id;

    try {
        const newTask = await taskService.createTask({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo, // Email of the user
            projectId: parseInt(projectId),
            userId,
            remarks,
            rating,
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
}

export async function getTaskDetails(req: Request, res: Response) {
    const taskId = parseInt(req.params.taskId);

    try {
        const task = await taskService.getTaskDetails(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task details" });
    }
}
export async function updateTask(req: Request, res: Response) {
    const taskId = parseInt(req.params.taskId);
    const { title, description, status, priority, dueDate, assignedTo, remarks, rating } = req.body;
    const userId = req.body.id;

    try {
        const updatedTask = await taskService.updateTask({
            taskId,
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo: parseInt(assignedTo),
            userId,
            remarks,
            rating,
        });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
}


export async function deleteTask(req: Request, res: Response) {
    const taskId = parseInt(req.params.taskId);
    const userId = req.body.id;

    try {
        const result = await taskService.deleteTask(taskId, userId);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
}

export async function addTaskDependency(req: Request, res: Response) {
    const taskId = parseInt(req.params.taskId);
    const { dependsOnTaskId } = req.body;

    try {
        const dependency = await taskService.addTaskDependency(taskId, dependsOnTaskId);

        res.status(201).json(dependency);
    } catch (error) {
        res.status(500).json({ message: "Failed to add task dependency" });
    }
}

export async function removeTaskDependency(req: Request, res: Response) {
    const taskId = parseInt(req.params.taskId);
    const dependencyId = parseInt(req.params.dependencyId);

    try {
        await taskService.removeTaskDependency(taskId, dependencyId);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to remove task dependency" });
    }
}