import {jest} from '@jest/globals';

import {Comment} from '../../domain/comment.js';
import {UpdateCommentUseCase} from '../../application/use-cases/update-comment.use-case.js';

import type {CommentRepository} from '../../application/ports/comment-repository.js';

import {CommentNotFoundError} from '../../application/errors/comment-not-found.error.js';
import {CommentAccessDeniedError} from '../../application/errors/comment-access-denied.error.js';

describe('UpdateCommentUseCase', () => {
    const commentRepositoryMock: jest.Mocked<CommentRepository> = {
        findByUuid: jest.fn(),
        save: jest.fn(),
    };

    const commentRepository =
        commentRepositoryMock as unknown as CommentRepository;

    let useCase: UpdateCommentUseCase;

    beforeEach(() => {
        jest.clearAllMocks();

        useCase = new UpdateCommentUseCase(
            commentRepository,
        );
    });

    it('updates and saves a comment when the authenticated user is the owner', async () => {
        const commentUuid = 'comment-123';
        const memberCardUuid = 'member-123';

        const updateContentMock = jest.fn();

        const comment = {
            commentUuid,
            memberCardUuid,
            updateContent: updateContentMock,
        } as unknown as Comment;

        const dto = {
            commentUuid,
            memberCardUuid,
            content: 'Updated content',
        };

        commentRepositoryMock
            .findByUuid
            .mockResolvedValue(comment);

        await useCase.execute(dto);

        expect(commentRepositoryMock.findByUuid)
            .toHaveBeenCalledTimes(1);

        expect(commentRepositoryMock.findByUuid)
            .toHaveBeenCalledWith(commentUuid);

        expect(updateContentMock)
            .toHaveBeenCalledTimes(1);

        expect(updateContentMock)
            .toHaveBeenCalledWith(dto.content);

        expect(commentRepositoryMock.save)
            .toHaveBeenCalledTimes(1);

        expect(commentRepositoryMock.save)
            .toHaveBeenCalledWith(comment);
    });

    it('throws CommentNotFoundError when the comment does not exist', async () => {
        const dto = {
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
            content: 'Updated content',
        };

        commentRepositoryMock
            .findByUuid
            .mockResolvedValue(null);

        await expect(
            useCase.execute(dto),
        ).rejects.toBeInstanceOf(CommentNotFoundError);

        expect(commentRepositoryMock.save)
            .not.toHaveBeenCalled();
    });

    it('throws CommentAccessDeniedError when the authenticated user is not the owner', async () => {
        const comment = {
            commentUuid: 'comment-123',
            memberCardUuid: 'member-owner',
            updateContent: jest.fn(),
        } as unknown as Comment;

        const dto = {
            commentUuid: 'comment-123',
            memberCardUuid: 'member-hacker',
            content: 'Updated content',
        };

        commentRepositoryMock
            .findByUuid
            .mockResolvedValue(comment);

        await expect(
            useCase.execute(dto),
        ).rejects.toBeInstanceOf(CommentAccessDeniedError);

        expect(comment.updateContent)
            .not.toHaveBeenCalled();

        expect(commentRepositoryMock.save)
            .not.toHaveBeenCalled();
    });
});