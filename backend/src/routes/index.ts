import { Router } from "express";

import userRouter from './user.route'
const $ = Router();

$.use('/api/users', userRouter);

export default $;
