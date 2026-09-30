import {Router} from "express";

import type {CommentController} from "../controllers/comment.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

/**
 * Factory to initialize and configure Express routes for the comment management.
 *
 * @module CommentRoute
 * @param {commentController} commentController - The Controller handling business logic for comments.
 * @returns {Router} An Express router instance.
 *
 * @remarks
 *  - Most endpoints require authentification via {@link authMiddleware}.
 *  - Typically  mounted at 'api/comments'
 */
export function createCommentRouter(commentController: CommentController): Router {
    const router = Router();

    // Authenticated Routes
    router.post("/chapter/:chapterUuid", authMiddleware, commentController.createComment.bind(commentController));
    router.put("/:commentUuid", authMiddleware, commentController.updateComment.bind(commentController));
    router.delete("/:commentUuid", authMiddleware, commentController.deleteComment.bind(commentController));
    router.get("/user", authMiddleware, commentController.getUserComments.bind(commentController));

    // Public routes
    router.get("/public/chapter/:chapterUuid", commentController.getChapterComments.bind(commentController));

    return router;
}