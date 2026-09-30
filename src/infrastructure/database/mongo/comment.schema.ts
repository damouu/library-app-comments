import mongoose from "mongoose";
import type {CommentDocument} from "./comment.document.js";

const commentSchema = new mongoose.Schema<CommentDocument>(
    {
        commentUuid: {
            type: String,
            required: true,
            unique: true,
        },
        memberCardUuid: {
            type: String,
            required: true,
            index: true,
        },
        chapterUuid: {
            type: String,
            required: true,
            index: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        updatedAt: {
            type: Date,
            required: true,
        },
    },
);

export const CommentModel = mongoose.model<CommentDocument>(
    "Comment",
    commentSchema,
    "comments",
);