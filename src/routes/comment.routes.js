import {Router} from "express";
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

const saveComment = async (req, res) => {
    const comment = await commentController.createComment(req, res);
    return res.json({status: comment.status, comment: comment});
}

router.get('/dede', saveComment);


export default router;
