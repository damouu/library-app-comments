import * as commentService from '../services/comment.service.js';

export const createComment = async (req, res) => {
    try {

        const commentData = req.body;
        const newComment = await commentService.saveComment(commentData);
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({message: "Failed to create comment."});
    }
};