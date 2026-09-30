import {sanitizeComment} from "../utils/sanitize.ts";
import {CreateCommentDTO} from "./CreateCommentDTO.js";

export function mapCreateCommentRequest(req) {
    return new CreateCommentDTO(
        sanitizeComment(req.body.comment),
        req.params.chapterUuid,
        req.user.member_card_uuid,
        req.user.user_name,
        req.user.email,
        req.user.avatar_img_url
    );
}