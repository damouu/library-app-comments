import {jest} from '@jest/globals';

import {Comment} from '../../domain/comment.js';
import {DeleteCommentUseCase} from '../../application/use-cases/delete-comment.use-case.js';

import type {CommentRepository} from '../../application/ports/comment-repository.js';

import {CommentNotFoundError} from '../../application/errors/comment-not-found.error.js';
import {CommentAccessDeniedError} from '../../application/errors/comment-access-denied.error.js';

describe('DeleteCommentUseCase', () => {
    const commentRepositoryMock: jest.Mocked<CommentRepository> = {
        findByUuid: jest.fn(),
        save: jest.fn(),
    };

    const commentRepository =
        commentRepositoryMock as unknown as CommentRepository;

    let useCase: DeleteCommentUseCase;

    beforeEach(() => {
        jest.clearAllMocks();

        useCase = new DeleteCommentUseCase(
            commentRepository,
        );
    });

    it('marks a comment as deleted and saves it when the authenticated user is the owner', async () => {
        const commentUuid = 'comment-123';
        const memberCardUuid = 'member-123';

        const markAsDeletedMock = jest.fn();

        const comment = {
            commentUuid,
            memberCardUuid,
            markAsDeleted: markAsDeletedMock,
        } as unknown as Comment;

        const dto = {
            commentUuid,
            memberCardUuid,
        };

        commentRepositoryMock
            .findByUuid
            .mockResolvedValue(comment);

        await useCase.execute(dto);

        expect(commentRepositoryMock.findByUuid)
            .toHaveBeenCalledTimes(1);

        expect(commentRepositoryMock.findByUuid)
            .toHaveBeenCalledWith(commentUuid);

        expect(markAsDeletedMock)
            .toHaveBeenCalledTimes(1);

        expect(commentRepositoryMock.save)
            .toHaveBeenCalledTimes(1);

        expect(commentRepositoryMock.save)
            .toHaveBeenCalledWith(comment);
    });

    it('throws CommentNotFoundError when the comment does not exist', async () => {
        const dto = {
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
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
        const markAsDeletedMock = jest.fn();

        const comment = {
            commentUuid: 'comment-123',
            memberCardUuid: 'member-owner',
            markAsDeleted: markAsDeletedMock,
        } as unknown as Comment;

        const dto = {
            commentUuid: 'comment-123',
            memberCardUuid: 'member-hacker',
        };

        commentRepositoryMock
            .findByUuid
            .mockResolvedValue(comment);

        await expect(
            useCase.execute(dto),
        ).rejects.toBeInstanceOf(CommentAccessDeniedError);

        expect(markAsDeletedMock)
            .not.toHaveBeenCalled();

        expect(commentRepositoryMock.save)
            .not.toHaveBeenCalled();
    });
});