import type {CommentRepository} from "../../application/ports/comment-repository.js";
import type {Comment} from "../../domain/comment.js";
import {CommentModel} from "../database/mongo/comment.schema.js";
import {toComment, toCommentDocument} from "../mappers/comment.mapper.js";

export class MongoCommentRepository implements CommentRepository {

    async save(comment: Comment): Promise<void> {
        const documentData = toCommentDocument(comment);

        await CommentModel.findOneAndUpdate(
            {commentUuid: comment.commentUuid},
            {$set: documentData},
            {upsert: true, new: true}
        ).exec();
    }

    async findByUuid(commentUuid: string): Promise<Comment | null> {
        const document = await CommentModel.findOne({
            commentUuid,
            deletedAt: null
        }).exec();

        if (!document) {
            return null;
        }

        return toComment(document);
    }
}