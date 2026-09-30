import type {Request} from "express";
import type {UpdateCommentDTO} from "../../../../application/dto/update-comment.dto.js";
import type {UpdateCommentBody} from "../../types/comment-request.js";

import {sanitizeComment} from "../../middleware/sanitize.js"


/**
 * Function to map into a `UpdateCommentDTO` type DTO
 *
 * @param req - 'commentUuid`
 * @param {UpdateCommentBody} req - `UpdateCommentBody`   
 * @return {UpdateCommentDTO}
 */
export function mapUpdateCommentRequest(req: Request<{ commentUuid: string }, unknown, UpdateCommentBody>): UpdateCommentDTO {
    return {
        commentUuid: req.params.commentUuid,
        memberCardUuid: req.user.memberCardUuid,
        content: sanitizeComment(req.body.comment),
    };
}