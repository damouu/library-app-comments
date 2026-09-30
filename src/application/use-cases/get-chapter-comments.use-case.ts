import type {CommentQueryService} from "../ports/comment-query.service.js";
import type {GetCommentsDTO} from "../dto/get-comments.dto.js";
import type {CommentPage} from "../types/comment-page.js";
import {ChapterComment} from "../types/chapter-comment.js";

export class GetChapterCommentsUseCase {
    constructor(private readonly commentQueryService: CommentQueryService) {
    }

    private validatePagination(page: number, size: number) {
        return {
            page: Math.max(1, page),
            size: Math.min(50, Math.max(1, size)),
        };
    }

    async execute(dto: GetCommentsDTO): Promise<CommentPage<ChapterComment>> {
        const {page, size} = this.validatePagination(dto.page, dto.size);

        return this.commentQueryService.findByChapter(page, size, dto.chapterUuid);
    }
}