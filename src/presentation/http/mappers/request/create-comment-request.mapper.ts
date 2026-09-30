import type {Request} from "express";

import type {CreateCommentDTO} from "../../../../application/dto/create-comment.dto.js";
import type {CreateCommentBody} from "../../types/comment-request.js";

import {sanitizeComment} from "../../../http/middleware/sanitize.js";

/**
 * Function to map a rquest of creating comment type into a `CreateCommentDTO` dto type.
 *
 * @param req - `chapterUuid`
 * @param req - `CreateCommentBody`
 * @return {CreateCommentDTO} CreateCommentDTO
 */
export function mapCreateCommentRequest(req: Request<{ chapterUuid: string }, unknown, CreateCommentBody>): CreateCommentDTO {
    return {
        content: sanitizeComment(req.body.comment),
        chapterUuid: req.params.chapterUuid,
        memberCardUuid: req.user.memberCardUuid,
    };
}