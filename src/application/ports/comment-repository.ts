import type {Comment} from "../../domain/comment.js";

export interface CommentRepository {
    save(comment: Comment): Promise<void>;

    findByUuid(commentUuid: string): Promise<Comment | null>;
}