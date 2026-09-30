import type {CommentRepository} from "../ports/comment-repository.js";
import type {DeleteCommentDTO} from "../dto/delete-comment.dto.js";
import {CommentNotFoundError} from "../errors/comment-not-found.error.js";
import {CommentAccessDeniedError} from "../errors/comment-access-denied.error.js";

export class DeleteCommentUseCase {
    constructor(private readonly commentRepository: CommentRepository) {
    }

    async execute(dto: DeleteCommentDTO): Promise<void> {
        const comment = await this.commentRepository.findByUuid(dto.commentUuid);
        if (!comment) {
            throw new CommentNotFoundError();
        }

        if (comment.memberCardUuid !== dto.memberCardUuid) {
            throw new CommentAccessDeniedError();
        }

        comment.markAsDeleted();

        await this.commentRepository.save(comment);
    }
}