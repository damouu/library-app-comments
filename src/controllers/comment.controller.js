import * as commentService from "../services/comment.service.js";
import {sanitizeComment} from "../utils/sanitize.js";
import {mapCreateCommentRequest} from "../dto/mapCreateCommentRequest.js";

export const createComment = async (req, res) => {
    try {

        const dto = mapCreateCommentRequest(req);

        const newComment = await commentService.saveComment(dto);

        res.status(201).json(newComment);

    } catch (error) {
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

export const getChapterComment = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;

        const chapterUuid = req.params.chapterUuid;

        const result = await commentService.getComments(page, size, chapterUuid);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({message: "Error fetching comments"});
    }
}