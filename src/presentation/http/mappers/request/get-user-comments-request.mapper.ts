import type {Request} from "express";
import type {GetUserCommentsDTO} from "../../../../application/dto/get-user-comments.dto.js";
import type {CommentPaginationQuery} from "../../types/comment-request.js";

/**
 * Function to map into a `GetUserCommentsDTO`
 *
 * @param req
 * @param req `CommentPaginationQuery`
 * @return {GetUserCommentsDTO} GetUserCommentsDTO
 */
export function mapGetUserCommentsRequest(req: Request<Record<string, never>, unknown, unknown, CommentPaginationQuery>): GetUserCommentsDTO {
    return {
        page: Number(req.query.page) || 1,
        size: Number(req.query.size) || 5,
        memberCardUuid: req.user.memberCardUuid,
    };
}