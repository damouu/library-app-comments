import type {Request} from "express";
import type {DeleteCommentDTO} from "../../../../application/dto/delete-comment.dto.js";

/**
 * Function to map a request of deleting request into a `DeleteCommentDTO` type.
 *
 * @param req  - `commentUuid`
 * @return {DeleteCommentDTO} DeleteCommentDTO return a `DeleteCommentDTO`
 */
export function mapDeleteCommentRequest(req: Request<{ commentUuid: string }>): DeleteCommentDTO {
    return {
        commentUuid: req.params.commentUuid,
        memberCardUuid: req.user.memberCardUuid,
    };
}