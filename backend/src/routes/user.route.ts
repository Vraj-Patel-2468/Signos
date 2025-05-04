import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    getUserTeamsAndProjects
} from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import upload from '../middlewares/multer';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), updateUserProfile);
router.get('/teams-projects', authMiddleware, getUserTeamsAndProjects);
router.get('/', authMiddleware, getAllUsers);
router.delete('/:userId', authMiddleware, deleteUser);

export default router;
