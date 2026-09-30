import {Comment} from "../../domain/comment.js";
import type {CommentDocument} from "../database/mongo/comment.document.js";


/**
 * Function to map into a `Comment` into a type model.
 *
 * @param document
 * @return {Comment} Comment
 */
export function toCommentDocument(comment: Comment): CommentDocument {
    return {
        commentUuid: comment.commentUuid,
        memberCardUuid: comment.memberCardUuid,
        chapterUuid: comment.chapterUuid,
        userName: comment.userName,
        userEmail: comment.userEmail,
        avatarUrl: comment.avatarUrl,
        content: comment.content,
        deletedAt: comment.deletedAt,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
    };
}


/**
 * Function to map into a `Comment` type model.
 *
 * @param document
 * @return {Comment} Comment
 */
export function toComment(document: CommentDocument): Comment {
    return Comment.reconstitute({
        commentUuid: document.commentUuid,
        memberCardUuid: document.memberCardUuid,
        chapterUuid: document.chapterUuid,
        userName: document.userName,
        userEmail: document.userEmail,
        avatarUrl: document.avatarUrl,
        content: document.content,
        deletedAt: document.deletedAt,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    });
}