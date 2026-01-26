import * as commentService from "../services/comment.service.js";
import {sanitizeComment} from "../utils/sanitize.js";

export const createComment = async (req, res) => {
    try {
        const {comment} = req.body;
        const chapterUuid = req.params.chapterUuid;
        const cleanComment = sanitizeComment(comment);

        const {
            user_memberCardUUID = req.user.user_memberCardUUID,
            userName = req.user.name,
            userEmail = req.user.email,
            avatar_URL = req.user.avatar_img_url,
        } = req.user;

        const newComment = await commentService.saveComment({
            comment: cleanComment,
            chapterUUID: chapterUuid,
            memberCardUuid: user_memberCardUUID,
            userName: userName,
            userEmail: userEmail,
            avatar_URL: avatar_URL,
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({message: "Failed to create comment."});
    }
};