import express from "express";
import { upload } from "../middlewares/auth.middleware";
import { registerUser } from "../controllers";

const router = express.Router();

router.route('/register').post(upload.single("profileImage"), registerUser);


export default router;