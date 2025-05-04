import { Application, Request, Response } from 'express';
import * as teamService from '../services/team.service';

export async function createTeam (req: Request, res: Response) {
    const { name, description } = req.body;
    const userId = req.body.id; 
    
    console.log("In controller");
    try {
        const newTeam = await teamService.createTeam({
            name,
            description,
            users: {
                create: [
                    {
                        userId: userId,
                        roleInTeam: 'Leader',
                    },
                ],
            },
        });

        const response = {
            id: newTeam.id,
            name: newTeam.name,
            description: newTeam.description,
            createdAt: newTeam.createdAt,
            users: newTeam.users.map((user) => ({
                ...user,
                userId: undefined,
                password: undefined,
            })),
        };

        res.status(201).json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create team';
        res.status(500).json({ message: errorMessage });
    }
    return;
};

export async function getTeamDetails(req: Request, res: Response) {
    const teamId = parseInt(req.params.teamId);

    try {
        const team = await teamService.getTeamDetails(teamId);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const response = {
            id: team.id,
            name: team.name,
            description: team.description,
            createdAt: team.createdAt,
            users: team.users,
            projects: team.projects
        };

        res.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team details';
        res.status(500).json({ message: errorMessage });
    }
};

export async function addUserToTeam(req: Request, res: Response) {
    const teamId = parseInt(req.params.teamId);
    const { email, role } = req.body;
    const requestingUserId = req.body.id; 

    try {
        const result = await teamService.addUserToTeam(teamId, email, role, requestingUserId);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(201).json({ message: 'User added to the team successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add user to team';
        res.status(500).json({ message: errorMessage });
    }
};

export async function removeUserFromTeam (req: Request, res: Response) {
    const teamId = parseInt(req.params.teamId);
    const { email } = req.body;
    const requestingUserId = req.body.id; 

    try {
        const result = await teamService.removeUserFromTeam(teamId, email, requestingUserId);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove user from team';
        res.status(500).json({ message: errorMessage });
    }
};

export async function deleteTeam(req: Request, res: Response) {
    const teamId = parseInt(req.params.teamId);
    const requestingUserId = req.body.id;

    try {
        const result = await teamService.deleteTeam(teamId, requestingUserId);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete team';
        res.status(500).json({ message: errorMessage });
    }
}
