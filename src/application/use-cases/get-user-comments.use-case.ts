import type {CommentQueryService} from "../ports/comment-query.service.js";
import type {GetUserCommentsDTO} from "../dto/get-user-comments.dto.js";
import type {CommentPage} from "../types/comment-page.js";
import {UserComment} from "../types/user-comment.js";

export class GetUserCommentsUseCase {
    constructor(private readonly commentQueryService: CommentQueryService) {
    }

    private validatePagination(page: number, size: number) {
        return {
            page: Math.max(1, page),
            size: Math.min(50, Math.max(1, size)),
        };
    }

    async execute(dto: GetUserCommentsDTO): Promise<CommentPage<UserComment>> {
        const {page, size} = this.validatePagination(dto.page, dto.size);

        return this.commentQueryService.findByUser(page, size, dto.memberCardUuid);
    }
}