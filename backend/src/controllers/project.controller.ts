import { Request, Response } from "express";
import * as projectService from "../services/project.service";

export async function createProject(req: Request, res: Response) {
    const { name, description, teamId } = req.body;
    const userId = req.body.id; 
    console.log(name, description, teamId, userId);
    try {
        const newProject = await projectService.createProject({ name, description, teamId, userId });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Failed to create project" });
    }
}

export async function getProjectDetails(req: Request, res: Response) {
    const projectId = parseInt(req.params.projectId);

    try {
        const project = await projectService.getProjectDetails(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch project details" });
    }
}

export async function deleteProject(req: Request, res: Response) {
    const projectId = parseInt(req.params.projectId);
    const requestingUserId = req.body.id; 

    try {
        const result = await projectService.deleteProject(projectId, requestingUserId);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete project" });
    }
}
