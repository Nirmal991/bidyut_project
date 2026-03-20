import express from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.route('/register').post(upload.single("profileImage"), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(verifyJWT, logoutUser);
router.route('/current-profile').get(verifyJWT, getCurrentUser);


export default router;