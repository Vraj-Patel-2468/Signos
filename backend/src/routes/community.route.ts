import express from 'express';
import { createCommunity, getCommunityPosts, updateCommunity, deleteCommunity } from '../controllers/community.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, createCommunity);
router.get('/:communityId/posts', authMiddleware, getCommunityPosts);
router.put('/:communityId', authMiddleware, updateCommunity);
router.delete('/:communityId', authMiddleware, deleteCommunity);

export default router;