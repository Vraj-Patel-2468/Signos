import { prisma } from "../utils/prisma";

export const createProject = async ({ name, description, teamId, userId }: { name: string; description: string; teamId: number; userId: number }) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: true },
        });

        if (!team) {
            return { error: "Team not found", status: 404 };
        }

        const isMember = team.users.some((teamUser) => teamUser.userId === userId);
        if (!isMember) {
            return { error: "You are not a member of this team", status: 403 };
        }
        console.log(name, description, teamId, userId);
        const isLeader = team.users.some((teamUser) => teamUser.userId === userId && teamUser.roleInTeam === "Leader");
        if (!isLeader) {
            return { error: "Only team leaders can create projects", status: 403 };
        }

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                teamId,
            },
        });

        return newProject;
    } catch (error) {
        throw new Error("Failed to create project");
    }
};

export const getProjectDetails = async (projectId: number) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { team: true, tasks: true },
        });

        if (!project) {
            throw new Error("Project not found");
        }

        return project;
    } catch (error) {
        throw new Error("Failed to fetch project details");
    }
};

export const deleteProject = async (projectId: number, requestingUserId: number) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { team: { include: { users: true } } },
        });

        if (!project) {
            return { error: "Project not found", status: 404 };
        }

        const isLeader = project.team.users.some(
            (user) => user.userId === requestingUserId && user.roleInTeam === "Leader"
        );

        if (!isLeader) {
            return { error: "Only team leaders can delete projects", status: 403 };
        }

        await prisma.project.delete({
            where: { id: projectId },
        });

        return { message: "Project deleted successfully" };
    } catch (error) {
        throw new Error("Failed to delete project");
    }
};
