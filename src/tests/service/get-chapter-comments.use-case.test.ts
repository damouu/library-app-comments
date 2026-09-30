import {jest} from '@jest/globals';

import {GetUserCommentsUseCase} from '../../application/use-cases/get-user-comments.use-case.js';
import type {CommentQueryService} from '../../application/ports/comment-query.service.js';
import {UserComment} from "../../application/types/user-comment.js";
import {CommentPage} from "../../application/types/comment-page.js";

describe('GetUserCommentsUseCase', () => {
    const queryServiceMock: jest.Mocked<CommentQueryService> = {
        findByUser: jest.fn(),
        findByChapter: jest.fn(),
    };

    let useCase: GetUserCommentsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();

        useCase = new GetUserCommentsUseCase(
            queryServiceMock,
        );
    });

    it('clamps page and size to valid ranges', async () => {
        queryServiceMock.findByUser.mockResolvedValue({
            data: [],
            meta: {
                page: 1,
                size: 50,
                count: 0,
                total: 0,
                total_pages: 0,
            },
        });

        await useCase.execute({
            page: -5,
            size: 100,
            memberCardUuid: 'user-123',
        });

        expect(queryServiceMock.findByUser).toHaveBeenCalledWith(
            1,
            50,
            'user-123',
        );
    });

    it('returns the query service result when no comments are found', async () => {
        const result = {
            data: [],
            meta: {
                page: 1,
                size: 5,
                count: 0,
                total: 0,
                total_pages: 0,
            },
        };

        queryServiceMock.findByUser.mockResolvedValue(result);

        const response = await useCase.execute({
            page: 1,
            size: 5,
            memberCardUuid: 'user-123',
        });

        expect(response).toBe(result);
    });

    it("should return the user's comments", async () => {
        const result: CommentPage<UserComment> = {
            data: [
                {
                    commentUuid: "comment-123",
                    chapterUuid: "chapter-123",
                    userName: "John",
                    avatarUrl: null,
                    content: "Hello",
                    deletedAt: null,
                    createdAt: new Date("2026-09-28T10:00:00Z"),
                    updatedAt: new Date("2026-09-28T10:00:00Z"),
                },
            ],
            meta: {
                page: 1,
                size: 10,
                count: 1,
                total: 1,
                total_pages: 1,
            },
        };

        queryServiceMock.findByUser.mockResolvedValue(result);

        const response = await useCase.execute({
            page: 1,
            size: 10,
            memberCardUuid: "user-123",
        });

        expect(response).toEqual(result);

        expect(queryServiceMock.findByUser).toHaveBeenCalledWith(
            1,
            10,
            "user-123",
        );
    });
});