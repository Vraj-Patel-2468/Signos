import { Request, Response } from 'express';
import * as communityService from '../services/community.service';

export const createCommunity = async (req: Request, res: Response) => {
    const communityData = req.body;
    try {
        const newCommunity = await communityService.createCommunity(communityData);
        res.status(201).json(newCommunity);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getCommunityPosts = async (req: Request, res: Response) => {
    const communityId = parseInt(req.params.communityId);
    try {
        const posts = await communityService.getCommunityPosts(communityId);
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateCommunity = async (req: Request, res: Response) => {
    const communityId = parseInt(req.params.communityId);
    const updateData = req.body;
    try {
        const updatedCommunity = await communityService.updateCommunity(communityId, updateData);
        res.json(updatedCommunity);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteCommunity = async (req: Request, res: Response) => {
    const communityId = parseInt(req.params.communityId);
    try {
        await communityService.deleteCommunity(communityId);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
};