import { Router } from 'express';
import { login, signUp, sendOtp } from '../controllers/auth.controller';
const router = Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/send-otp', sendOtp);

export default router;