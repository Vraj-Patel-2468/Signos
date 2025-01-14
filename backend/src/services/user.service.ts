import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/managePassword";
import TeamUser from "../types/TeamUser";

export async function fetchUserByEmail(email: string) {
  try {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });
    const userDetails = { ...user, password: "" };
    return userDetails;
  } catch (error) {
    throw new Error("msg: error in fetching user by email.");
  }
}

export async function fetchUserById(id: number) {
  try {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { id } });
    const userDetails = { ...user, password: "" };
    return userDetails;
  } catch (error) {
    throw new Error("msg: error in fetching user by id.");
  }
}

export async function deleteUserWithId(id: number) {
    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.delete({ where: { id } });
        const userDetails = { ...user, password: "" };
        return userDetails;
    } catch (error) {
        throw new Error("msg: error in deleting user by id.");
    }
}

export async function deleteUserWithEmail(email: string) {
    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.delete({ where: { email } });
        const userDetails = { ...user, password: "" };
        return userDetails;
    } catch (error) {
        throw new Error("msg: error in deleting user by email.");
    }
}


export async function updateUserEmail(email: string, newEmail: string) {
    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.update({ where: { email }, data: {
                email: newEmail, 
                updatedAt: new Date(Date.now())
            }
         });
        const userDetails = { ...user, password: "" };
        return userDetails;
    } catch (error) {
        throw new Error("msg: error in updating user email.");
    }
}

export async function updateUserPassword(email: string, newPassword: string) {
    try {
        const prisma = new PrismaClient();
        const hashedPassword = await hashPassword(newPassword);
        const user = await prisma.user.update({ where: { email }, data: { 
                password: hashedPassword, 
                updatedAt: new Date(Date.now())
            } 
        });
        const userDetails = { ...user, password: "" };
        return userDetails;
    } catch (error) {
        throw new Error("msg: error in updating user password.");
    }
}

export async function updateUserDetails(user: { email: string; password: string, username: string }) {
    try {
        const prisma = new PrismaClient();
        const hashedPassword = await hashPassword(user.password);
        const updatedUser = await prisma.user.update({ where: { email: user.email }, data: {
                password: hashedPassword, 
                username: user.username,
                updatedAt: new Date(Date.now())
            } 
        });
        const userDetails = { ...updatedUser, password: "" };
        return userDetails;
    } catch (error) {
        throw new Error("msg: error in updating user.");
    }
}

export async function getUserTeamsUsingMail(email: string) {
    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({ where: { email }, include: { teams: true } });
        if(!user) {
            throw new Error("msg: user not found.");
        }
        const teamSummary = user.teams.map(async (teamUser: TeamUser) => {
            const teamDetails = await prisma.team.findUnique({ where: { id: teamUser.teamId } });
            return {
                teamId: teamDetails?.id,
                teamName: teamDetails?.name,
                teamDescription: teamDetails?.description,
                addedAt: teamUser.addedAt,
                roleInTeam: teamUser.roleInTeam
            }   
        })
        return teamSummary;
    } catch (error) {
        throw new Error("msg: error in getting user teams.");       
    }
}

export async function createNewTeamWithUser(teamName: string, teamDescription: string, email: string) {
    try {
        const prisma = new PrismaClient();
        const userReq = await prisma.user.findUnique({ where: { email } });
        if(!userReq) {
            throw new Error("msg: user not found.");
        }
        const team = await prisma.team.create({
            data: {
                name: teamName,
                description: teamDescription,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                users: {
                    create : [{
                        userId: userReq.id,
                        roleInTeam: Role.TeamLeader 
                    }]
                }
            },
            include: {
                users: true
            }
        })
        return team;
    } catch (error) {
        console.error(error);
        throw new Error("msg: error in creating new team.");
    }
}
