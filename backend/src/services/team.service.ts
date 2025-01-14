import { PrismaClient } from "@prisma/client";

export async function fetchTeamById(id: number) {
    try {
        const prisma = new PrismaClient();
        const team = await prisma.team.findUnique({ where: { id } });
        return team;
    } catch (error) {
        throw new Error("msg: error in fetching team by id.");
    }
}

export async function fetchTeamsByUser(userId: number) {
    try {
        const prisma = new PrismaClient();
        const teams = await prisma.team.findMany({
             where: { 
                users: {
                    some: { userId } 
                } 
            } 
        });
        return teams;
    } catch (error) {
        throw new Error("msg: error in fetching teams by user.");
    }
}

export async function deleteTeamById(id: number) {
    try {
        const prisma = new PrismaClient();
        const team = await prisma.team.delete({ where: { id } });
        return team;
    } catch (error) {
        throw new Error("msg: error in deleting team by id.");
    }
}

export async function updateTeamDetails({ id, teamName, teamDescription }: { id: number, teamName: string, teamDescription: string }) {
    try {
        const prisma = new PrismaClient();
        const team = await prisma.team.update({ where: { id }, data: { 
            name: teamName, 
            description: teamDescription, 
            updatedAt: new Date(Date.now())
        } 
    });
        return team;
    } catch (error) {
        throw new Error("msg: error in updating team details.");
    }
}

export async function addUsersToTeam(userIdsToAdd: number[], teamId: number) {
    try {
        const prisma = new PrismaClient();
        const team = await prisma.team.update({
            where: { id: teamId },
            data: {
                users: {
                    create: userIdsToAdd.map((id) => ({
                        userId: id, 
                        roleInTeam: Role.TeamMember,
                        addedAt: new Date(Date.now())
                    })),
                },
            },
        });
        return team;
    } catch (error) {
        throw new Error("msg: error in adding users to team.");
    }
}

export async function removeUserFromTeam(userId: number, teamId: number) {
    try {
        const prisma = new PrismaClient();
        const team = await prisma.team.update({
            where: { id: teamId },
            data: {
                users: {
                    delete: {
                        userId_teamId: { userId, teamId },
                    },
                },
            },
        });
        return team;
    } catch (error) {
        throw new Error("msg: error in removing user from team.");
    }
}

export async function createProject(teamId: number, projectName: string, projectDescription: string) {
    try {
        const prisma = new PrismaClient();
        const project = await prisma.project.create({
            data: {
                name: projectName,
                desription: projectDescription,
                startedAt: new Date(Date.now()),
                completedAt: new Date(Date.now()),
                teamId
            }
        });
        return project;
    } catch (error) {
        throw new Error("msg: error in creating project.");
    }
}
