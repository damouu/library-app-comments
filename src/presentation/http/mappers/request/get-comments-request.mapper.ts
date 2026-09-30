import type {Request} from "express";
import type {GetCommentsDTO} from "../../../../application/dto/get-comments.dto.js";
import type {CommentPaginationQuery} from "../../types/comment-request.js";


/**
 * Function to map an incoming request of GetComment into a `GetCommentsDTO` DTO type.
 *
 * @param req -  `chapterUuid`
 * @param req -  `CommentPaginationQuery`
 * @return {GetCommentsDTO} GetCommentsDTO
 */
export function mapGetCommentsRequest(req: Request<{ chapterUuid: string }, unknown, unknown, CommentPaginationQuery>): GetCommentsDTO {
    return {
        page: Number(req.query.page) || 1,
        size: Number(req.query.size) || 5,
        chapterUuid: req.params.chapterUuid,
    };
}