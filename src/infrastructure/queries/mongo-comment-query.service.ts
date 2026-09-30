import type {CommentQueryService} from "../../application/ports/comment-query.service.js";
import type {CommentPage} from "../../application/types/comment-page.js";
import {CommentModel} from "../database/mongo/comment.schema.js";
import {ChapterComment} from "../../application/types/chapter-comment.js";
import {UserComment} from "../../application/types/user-comment.js";

export class MongoCommentQueryService implements CommentQueryService {

    async findByUser(page: number, size: number, memberCardUuid: string): Promise<CommentPage<UserComment>> {
        const skip = (page - 1) * size;
        const filter = {memberCardUuid, deletedAt: null};

        const [comments, total] = await Promise.all([
            CommentModel.find(filter)
                .select("-__v -memberCardUuid -_id -userEmail")
                .sort({createdAt: -1})
                .skip(skip)
                .limit(size)
                .exec(),
            CommentModel.countDocuments(filter),
        ]);

        return {
            data: comments.map(doc => ({
                commentUuid: doc.commentUuid,
                chapterUuid: doc.chapterUuid,
                userName: doc.userName,
                avatarUrl: doc.avatarUrl,
                content: doc.content,
                deletedAt: doc.deletedAt,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            })),
            meta: {
                page: page,
                size: size,
                count: comments.length,
                total,
                total_pages: Math.ceil(total / size),
            },
        };
    }

    async findByChapter(page: number, size: number, chapterUuid: string): Promise<CommentPage<ChapterComment>> {
        const skip = (page - 1) * size;
        const filter = {chapterUuid, deletedAt: null};

        const [comments, total] = await Promise.all([
            CommentModel.find(filter)
                .select("-__v -memberCardUuid -_id -userEmail")
                .sort({createdAt: -1})
                .skip(skip)
                .limit(size)
                .exec(),
            CommentModel.countDocuments(filter),
        ]);

        return {
            data: comments.map(doc => ({
                commentUuid: doc.commentUuid,
                chapterUuid: doc.chapterUuid,
                userName: doc.userName,
                avatarUrl: doc.avatarUrl,
                content: doc.content,
                deletedAt: doc.deletedAt,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            })),
            meta: {
                page: page,
                size: size,
                count: comments.length,
                total,
                total_pages: Math.ceil(total / size),
            },
        };
    }
}