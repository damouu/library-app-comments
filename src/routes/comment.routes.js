import {Router} from "express";
import {authMiddleware} from '../middleware/auth.middleware.js';
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

router.post('/chapter/:chapterUuid/comment', authMiddleware, commentController.createComment);

router.put('/comment/:commentUuid', authMiddleware, commentController.updateComment);

export default router;
