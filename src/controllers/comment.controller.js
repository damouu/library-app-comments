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


export const updateComment = async (req, res) => {
    try {
        const {comment} = req.body;
        const commentUuid = req.params.commentUuid;
        const cleanComment = sanitizeComment(comment);

        await commentService.updateComment({
            comment: cleanComment, commentUuid: commentUuid, user_memberCardUUID: req.user.user_memberCardUUID
        });

        res.status(204).send();
    } catch (error) {
        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({message: error.message});
        }
        if (error.message === "Comment not found.") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: "Server Error"});
    }
};


export const deleteComment = async (req, res) => {

    try {

        const commentUuid = req.params.commentUuid;

        await commentService.deleteComment({
            commentUuid: commentUuid, user_memberCardUUID: req.user.user_memberCardUUID,
        });

        res.status(204).send();
    } catch (error) {
        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({message: error.message});
        }
        if (error.message === "Comment not found.") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: "Server Error"});
    }

};

export const getUserComment = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;

        const memberCardUuid = req.user.user_memberCardUUID;

        const result = await commentService.getUserComment(page, size, memberCardUuid);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({message: "Error fetching comments"});
    }
}