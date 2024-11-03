import { Router } from "express"
import { checkAuth, forgotPassword, login, logout, register, resetPassword, verifyEmail } from '../controllers/user.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";


const router = Router();

router.route('/check-auth').get(verifyToken,checkAuth)
// router.post('/register', register); //or use
router.route('/register').post(register);

router.route('/verify-email').post(verifyEmail);

router.route('/login').post(login);

router.route('/logout').post(logout);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password/:token').post(resetPassword);

export default router