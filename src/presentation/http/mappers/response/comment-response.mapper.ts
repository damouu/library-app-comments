import {Comment} from "../../../../domain/comment.js";
import {CommentCreatedResponseDTO} from "../../dto/response/comment-created.response.dto.js";

export function mapToCommentCreatedResponse(comment: Comment): CommentCreatedResponseDTO {
    return {
        props: {
            user_name: comment.userName,
            chapter_uuid: comment.chapterUuid,
            comment_uuid: comment.commentUuid,
            avatar_url: comment.avatarUrl,
            content: comment.content,
            deleted_at: comment.deletedAt,
            created_at: comment.createdAt,
            updated_at: comment.updatedAt,
        },
    };
}