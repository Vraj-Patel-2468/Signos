import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCommunity = async (communityData: any) => {
    return await prisma.community.create({
        data: communityData
    });
};

export const getCommunityPosts = async (communityId: number) => {
    return await prisma.post.findMany({
        where: { communityId }
    });
};

export const updateCommunity = async (communityId: number, updateData: any) => {
    return await prisma.community.update({
        where: { id: communityId },
        data: updateData
    });
};

export const deleteCommunity = async (communityId: number) => {
    return await prisma.community.delete({
        where: { id: communityId }
    });
};