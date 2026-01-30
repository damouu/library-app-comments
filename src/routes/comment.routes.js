import {Router} from "express";
import {authMiddleware} from '../middleware/auth.middleware.js';
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

router.post('/chapter/:chapterUuid', authMiddleware, commentController.createComment);

router.put('/:commentUuid', authMiddleware, commentController.updateComment);

router.delete('/:commentUuid', authMiddleware, commentController.deleteComment);

router.get('/user', authMiddleware, commentController.getUserComment);

router.get('/public/chapter/:chapterUuid', commentController.getChapterComment);

export default router;
