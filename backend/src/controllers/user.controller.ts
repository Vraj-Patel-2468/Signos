import { Request, Response } from "express";
import { updateUserDetails, deleteUserWithId, deleteUserWithEmail, fetchUserByEmail, fetchUserById, getUserTeamsUsingMail, createNewTeamWithUser } from "../services/user.service"; 

export async function getUser(req: Request, res: Response): Promise<any> {
    const { email, id } = req.body;
    if (!email && !id) {
        return res.status(400).json({ message: "no email or id is found." });
    }
    try {
        const userDetails = email ? await fetchUserByEmail(email) : await fetchUserById(id);
        return res.status(200).json({ message: "User details fetched successfully", userDetails });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error fetching user details", error });
    }
}

export async function updateUser(req: Request, res: Response): Promise<any> {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Insufficient data is provided" });
    }
    try {
        const userDetails = await updateUserDetails({ email, password, username });
        return res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error updating user details" });
    }
}

export async function deleteUser(req: Request, res: Response): Promise<any> {
    const { id, email } = req.body;
    try {
        const userDetails = email ? await deleteUserWithEmail(email) : await deleteUserWithId(id);
        return res.status(200).json({ message: "User details deleted successfully" });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error deleting user details" });
    }
}

export async function getUserTeams(req: Request, res: Response): Promise<any> {
    const {  email } = req.body;
    try {
        const teams = await getUserTeamsUsingMail(email);
        return res.status(200).json({ message: "User teams fetched successfully", teams }); 
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
}    

export async function createTeam(req: Request, res: Response): Promise<any> {
    const { teamName, teamDescription, email } = req.body;
    try {
        const team = await createNewTeamWithUser(teamName, teamDescription, email);
        return res.status(200).json({ message: "Team created successfully", team });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Error creating team" });
    }
}