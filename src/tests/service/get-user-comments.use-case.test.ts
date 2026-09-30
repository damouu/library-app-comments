import {jest} from '@jest/globals';

import {GetUserCommentsUseCase} from '../../application/use-cases/get-user-comments.use-case.js';
import type {CommentQueryService} from '../../application/ports/comment-query.service.js';

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
});