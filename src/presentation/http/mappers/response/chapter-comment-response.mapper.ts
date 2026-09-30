import type {ChapterComment} from "../../../../application/types/chapter-comment.js";
import {ChapterCommentResponseDTO} from "../../dto/response/chapter-comment.response.dto.js";
import {CommentPage} from "../../../../application/types/comment-page.js";

/**
 * Function to map a retrieve comment into a `ChapterCommentResponseDTO` for the http presentation layer.
 *
 * @param {comment} comment receives a `ChapterComment`
 * @return {ChapterCommentResponseDTO} returns a ChapterCommentResponseDTO
 */
export function mapToChapterCommentResponse(comment: ChapterComment): ChapterCommentResponseDTO {
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

/**
 * Function to map a multiples retrieved comments into a `CommentPage` type.
 *
 * @param commentPage
 * @param itemMapper
 */
export function mapToCommentPageResponse<T, R>(commentPage: CommentPage<T>, itemMapper: (item: T) => R): CommentPage<R> {
    return {
        data: commentPage.data.map(itemMapper),
        meta: {
            page: commentPage.meta.page,
            size: commentPage.meta.size,
            count: commentPage.meta.count,
            total: commentPage.meta.total,
            total_pages: commentPage.meta.total_pages,
        },
    };
}