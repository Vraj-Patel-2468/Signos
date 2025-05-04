import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.body.id;
    try {
        const profile = await userService.getUserProfile(userId);
        res.json({...profile, userId: "", id: "",  password: ""});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.body.id;
    const updateData = req.body;
    const file = req.file;
    try {
        const updatedProfile = await userService.updateUserProfile(userId, updateData, file);
        res.json(updatedProfile);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserTeamsAndProjects = async (req: Request, res: Response) => {
    const userId = req.body.id;
    try {
        const data = await userService.getUserTeamsAndProjects(userId);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    try {
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
