import { prisma } from './../utils/prisma';

export const createTeam = async (teamData: any) => {
    try {
        const newTeam = await prisma.team.create({
            data: {
                name: teamData.name,
                description: teamData.description,
                updatedAt: new Date(),
                users: {
                    create: [
                        {
                            userId: teamData.users.create[0].userId,
                            roleInTeam: teamData.users.create[0].roleInTeam,
                            addedAt: new Date(),
                        },
                    ] 
                },
            },
            include: { users: true },
        }) as any;

        const arrayOfUsers = await Promise.all(
            newTeam.users.map(async (teamEntity: any) => {
                return await prisma.user.findUnique({
                    where: { id: teamEntity.userId },
                });
            })
        );

        const response = {
            id: newTeam.id,
            name: newTeam.name,
            description: newTeam.description,
            createdAt: newTeam.createdAt,
            users: arrayOfUsers.map(userData => ({
                email: userData.email,
                username: userData.username,
            })), 
        };

        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to create team');
    }
};

export const getTeamDetails = async (teamId: number) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                users: {
                    include: {
                        user: true,
                    },
                },
                projects: true,
            },
        });

        if (!team) {
            throw new Error('Team not found');
        }

        const arrayOfUsers = await Promise.all(
            team.users.map(async (teamEntity: any) => {
                let data = await prisma.user.findUnique({
                    where: { id: teamEntity.userId },
                });
                return {
                    ...data,
                    id: undefined,
                    password: undefined,
                    roleInTeam: teamEntity.roleInTeam
                };
            })
        );

        const response = {
            id: team.id,
            name: team.name,
            description: team.description,
            createdAt: team.createdAt,
            projects: team.projects,
            users: arrayOfUsers
        };
        return response;
    } catch (error) {
        throw new Error('Failed to fetch team details');
    }
};

export const addUserToTeam = async (teamId: number, email: string, role: string, requestingUserId: number) => {
    try {
        console.log(teamId, email, role, requestingUserId);
        const userToAdd = await prisma.user.findUnique({
            where: { email },
        });
        if (!userToAdd) {
            return { error: 'User not found', status: 404 };
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: true },
        });

        if (!team) {
            return { error: 'Team not found', status: 404 };
        }
        const isLeader = team.users.some(
            (user) => user.userId === requestingUserId && user.roleInTeam === 'Leader'
        );

        if (!isLeader) {
            return { error: 'You do not have permission to add users to this team', status: 403 };
        }


        const existingUserInTeam = await prisma.teamUser.findUnique({
            where: {
                userId_teamId: {   
                    userId: userToAdd.id,
                    teamId: teamId,
                }
            },
        });
        console.log(existingUserInTeam);
        if (existingUserInTeam) {
            return { error: 'User is already in the team', status: 400 };
        }

        const result = await prisma.teamUser.create({
            data: {
                teamId,
                userId: userToAdd.id,
                roleInTeam: role,
                addedAt: new Date(),
            },
        });


        console.log(result);
        return { message: 'User added to the team successfully' };
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add user to team');
    }
};

export const removeUserFromTeam = async (teamId: number, email: string, requestingUserId: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: 'User not found', status: 404 };
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: true },
        });

        if (!team) {
            return { error: 'Team not found', status: 404 };
        }

        const isLeader = team.users.some(
            (user) => user.userId === requestingUserId && user.roleInTeam === 'Leader'
        );

        if (!isLeader) {
            return { error: 'You do not have permission to remove users from this team', status: 403 };
        }

        const isUserInTeam = team.users.some(
            (teamUser) => teamUser.userId === user.id
        );

        if (!isUserInTeam) {
            return { error: 'User is not in the team', status: 400 };
        }

        await prisma.teamUser.delete({
            where: {
                userId_teamId: {
                    userId: user.id, 
                    teamId,
                },
            },
        });

        return { message: 'User removed from the team successfully' };
    } catch (error) {
        console.log(error);
        throw new Error('Failed to remove user from team');
    }
};

export const deleteTeam = async (teamId: number, requestingUserId: number) => {
    try {
        // Fetch the team with users
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: true },
        });

        if (!team) {
            return { error: 'Team not found', status: 404 };
        }

        // Check if the requesting user is the team leader
        const isLeader = team.users.some(
            (teamUser) => teamUser.userId === requestingUserId && teamUser.roleInTeam === 'Leader'
        );

        if (!isLeader) {
            return { error: 'You do not have permission to delete this team', status: 403 };
        }

        // Delete all team-related records (teamUser associations)
        await prisma.teamUser.deleteMany({
            where: { teamId },
        });

        // Delete the team itself
        await prisma.team.delete({
            where: { id: teamId },
        });

        return { message: 'Team deleted successfully' };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete team');
    }
};
