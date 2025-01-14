import { Request, Response } from "express";
import { fetchTeamsByUser, fetchTeamById, deleteTeamById, updateTeamDetails, addUsersToTeam, removeUserFromTeam, createProject } from "../services/team.service";

export async function getTeamById(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
        const team = await fetchTeamById(id);
        return res.status(200).json({ message: "Team details fetched successfully", team });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error fetching team details" });
    }
}

export async function getUserTeams(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
        const teams = await fetchTeamsByUser(id); 
        return res.status(200).json({ message: "User teams fetched successfully", teams });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
}

export async function deleteTeam(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
        const team = await deleteTeamById(id);
        return res.status(200).json({ message: "Team details deleted successfully" });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error deleting team details" });
    }
}

export async function updateTeam(req: Request, res: Response): Promise<any> {
    const { id, teamName, teamDescription } = req.body;
    try {
        const team = await updateTeamDetails({ id, teamName, teamDescription });
        return res.status(200).json({ message: "Team details updated successfully" });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error updating team details" });
    }
}

export async function addUsers(req: Request, res: Response): Promise<any> {
    const { id, userIdsToAdd } = req.body;
    try {
        const team = await addUsersToTeam(userIdsToAdd, id);
        return res.status(200).json({ message: "Team created successfully", team });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error creating team" });
    }    
}

export async function removeUser(req: Request, res: Response): Promise<any> {
    const { userId, teamId } = req.body;
    try {
        const team = await removeUserFromTeam(userId, teamId);
        return res.status(200).json({ message: "Team created successfully", team });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error creating team" });
    }    
}

export async function makeProject(req: Request, res: Response): Promise<any> {
    const { teamId, projectName, projectDescription } = req.body;
    try {
        const project = await createProject(teamId, projectName, projectDescription);
        return res.status(200).json({ message: "Project created successfully", project });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error creating project" });
    }  
}
