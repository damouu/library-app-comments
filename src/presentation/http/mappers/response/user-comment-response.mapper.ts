import type {UserComment} from "../../../../application/types/user-comment.js";
import {UserCommentResponseDto} from "../../dto/response/user-comment.response.dto.js";

/**
 * function mapper to map into a `UserCommentResponseDto` type.
 *
 * @param {UserComment} comment
 * @return {UserCommentResponseDto} UserCommentResponseDto
 */
export function mapToUserCommentResponse(comment: UserComment): UserCommentResponseDto {
    return {
        comment_uuid: comment.commentUuid,
        chapter_uuid: comment.chapterUuid,
        user_name: comment.userName,
        avatar_url: comment.avatarUrl,
        content: comment.content,
        created_at: comment.createdAt,
        updated_at: comment.updatedAt,
        deleted_at: comment.deletedAt,
    };
}