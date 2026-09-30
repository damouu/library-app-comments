import {jest} from '@jest/globals';

import {Comment} from '../../domain/comment.js';
import {CreateCommentUseCase} from '../../application/use-cases/create-comment.use-case.js';

import type {CommentRepository} from '../../application/ports/comment-repository.js';
import type {MemberProjectionRepositoryPort} from '../../application/ports/member-projection.repository.port.js';

describe('CreateCommentUseCase', () => {
    const commentRepositoryMock: jest.Mocked<CommentRepository> = {
        save: jest.fn(),
        findByUuid: jest.fn(),
    };

    const memberProjectionRepositoryMock: jest.Mocked<MemberProjectionRepositoryPort> = {
        upsert: jest.fn(),
        update: jest.fn(),
        findByMemberCardUuid: jest.fn(),
    };

    const commentRepository =
        commentRepositoryMock as unknown as CommentRepository;

    const memberProjectionRepository =
        memberProjectionRepositoryMock as unknown as MemberProjectionRepositoryPort;

    let useCase: CreateCommentUseCase;

    beforeEach(() => {
        jest.clearAllMocks();

        useCase = new CreateCommentUseCase(
            commentRepository,
            memberProjectionRepository,
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('creates and saves a comment using the member projection data', async () => {
        const dto = {
            content: 'Hello world',
            chapterUuid: 'chapter-123',
            memberCardUuid: 'member-123',
        };

        const memberProjection = {
            memberCardUuid: 'member-123',
            username: 'Test User',
            email: 'test@example.com',
            avatarUrl: 'https://example.com/avatar.png',
        };

        const createdComment = {} as Comment;

        const createSpy = jest
            .spyOn(Comment, 'create')
            .mockReturnValue(createdComment);

        memberProjectionRepositoryMock
            .findByMemberCardUuid
            .mockResolvedValue(memberProjection);

        const result = await useCase.execute(dto);

        expect(
            memberProjectionRepositoryMock.findByMemberCardUuid,
        ).toHaveBeenCalledTimes(1);

        expect(
            memberProjectionRepositoryMock.findByMemberCardUuid,
        ).toHaveBeenCalledWith(
            dto.memberCardUuid,
        );

        expect(createSpy).toHaveBeenCalledTimes(1);

        expect(createSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                commentUuid: expect.any(String),
                memberCardUuid: memberProjection.memberCardUuid,
                userName: memberProjection.username,
                userEmail: memberProjection.email,
                avatarUrl: memberProjection.avatarUrl,
                chapterUuid: dto.chapterUuid,
                content: dto.content,
            }),
        );

        expect(commentRepositoryMock.save)
            .toHaveBeenCalledTimes(1);

        expect(commentRepositoryMock.save)
            .toHaveBeenCalledWith(createdComment);

        expect(result).toBe(createdComment);
    });

    it('throws an error when the member projection does not exist', async () => {
        const dto = {
            content: 'Hello world',
            chapterUuid: 'chapter-123',
            memberCardUuid: 'member-123',
        };

        memberProjectionRepositoryMock
            .findByMemberCardUuid
            .mockResolvedValue(null);

        await expect(
            useCase.execute(dto),
        ).rejects.toThrow('Member projection not found.');

        expect(commentRepositoryMock.save)
            .not.toHaveBeenCalled();
    });
});