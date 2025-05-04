import cloudinary from '../utils/cloudinary';
import { prisma } from '../utils/prisma';

export const getUserProfile = async (userId: number) => {
    return await prisma.userProfile.findUnique({
        where: { userId }, 
        include: { user: false }
    });
};

export const updateUserProfile = async (userId: number, updateData: any, file?: Express.Multer.File) => {
    if (file) {
        const uploadedImage = await cloudinary.uploader.upload(file.path);
        updateData.avatarUrl = uploadedImage.secure_url;
    }

    return await prisma.userProfile.update({
        where: { userId },
        data: updateData
    });
};

export const getUserTeamsAndProjects = async (userId: number) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            teams: {
                select: {
                    team: {
                        select: {
                            id: true,
                            name: true,
                            projects: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

export const getAllUsers = async () => {
    return await prisma.user.findMany({
        include: { profile: true }
    });
};

export const deleteUser = async (userId: number) => {
    return await prisma.user.delete({
        where: { id: userId }
    });
};
