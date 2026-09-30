import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import type {Request, Response} from 'express';

import {CommentController} from '../../presentation/http/controllers/comment.controller.js';
import type {CreateCommentUseCase} from '../../application/use-cases/create-comment.use-case.js';
import type {UpdateCommentUseCase} from '../../application/use-cases/update-comment.use-case.js';
import type {DeleteCommentUseCase} from '../../application/use-cases/delete-comment.use-case.js';
import type {GetUserCommentsUseCase} from '../../application/use-cases/get-user-comments.use-case.js';
import type {GetChapterCommentsUseCase} from '../../application/use-cases/get-chapter-comments.use-case.js';
import type {CommentPaginationQuery, CreateCommentBody} from '../../presentation/http/types/comment-request.js';

import {Comment} from '../../domain/comment.js';

describe('CommentController', () => {

    const createCommentUseCaseMock = {
        execute: jest.fn<CreateCommentUseCase['execute']>(),
    } as unknown as jest.Mocked<CreateCommentUseCase>;

    const updateCommentUseCaseMock = {
        execute: jest.fn<UpdateCommentUseCase['execute']>(),
    } as unknown as jest.Mocked<UpdateCommentUseCase>;

    const deleteCommentUseCaseMock = {
        execute: jest.fn<DeleteCommentUseCase['execute']>(),
    } as unknown as jest.Mocked<DeleteCommentUseCase>;

    const getUserCommentsUseCaseMock = {
        execute: jest.fn<GetUserCommentsUseCase['execute']>(),
    } as unknown as jest.Mocked<GetUserCommentsUseCase>;

    const getChapterCommentsUseCaseMock = {
        execute: jest.fn<GetChapterCommentsUseCase['execute']>(),
    } as unknown as jest.Mocked<GetChapterCommentsUseCase>;

    let controller: CommentController;

    const createResponseMock = (): Response => {
        const response = {
            status: jest.fn(),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        (response.status as jest.Mock).mockReturnValue(response);
        (response.json as jest.Mock).mockReturnValue(response);
        (response.send as jest.Mock).mockReturnValue(response);

        return response;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        controller = new CommentController(
            createCommentUseCaseMock,
            updateCommentUseCaseMock,
            deleteCommentUseCaseMock,
            getUserCommentsUseCaseMock,
            getChapterCommentsUseCaseMock,
        );
    });

    it('should create a comment', async () => {
        const comment = Comment.create({
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
            chapterUuid: 'chapter-123',
            userName: 'John',
            userEmail: 'john@example.com',
            avatarUrl: null,
            content: 'Hello world',
        });

        createCommentUseCaseMock.execute.mockResolvedValue(comment);

        const req = {
            params: {
                chapterUuid: 'chapter-123',
            },
            body: {
                comment: 'Hello world',
            },
            user: {
                memberCardUuid: 'member-123',
            },
        } as unknown as Request<
            { chapterUuid: string },
            unknown,
            CreateCommentBody
        >;

        const res = createResponseMock();

        await controller.createComment(req, res);

        expect(createCommentUseCaseMock.execute).toHaveBeenCalledWith({
            content: 'Hello world',
            chapterUuid: 'chapter-123',
            memberCardUuid: 'member-123',
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            props: {
                user_name: 'John',
                chapter_uuid: 'chapter-123',
                comment_uuid: 'comment-123',
                avatar_url: null,
                content: 'Hello world',
                deleted_at: null,
                created_at: comment.createdAt,
                updated_at: comment.updatedAt,
            },
        });
    });

    it('should update a comment', async () => {
        updateCommentUseCaseMock.execute.mockResolvedValue();

        const req = {
            params: {
                commentUuid: 'comment-123',
            },
            body: {
                comment: 'Updated content',
            },
            user: {
                memberCardUuid: 'member-123',
            },
        } as unknown as Request<
            { commentUuid: string },
            unknown,
            { comment: string }
        >;

        const res = createResponseMock();

        await controller.updateComment(req, res);

        expect(updateCommentUseCaseMock.execute).toHaveBeenCalledWith({
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
            content: 'Updated content',
        });

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should delete a comment', async () => {
        deleteCommentUseCaseMock.execute.mockResolvedValue();

        const req = {
            params: {
                commentUuid: 'comment-123',
            },
            user: {
                memberCardUuid: 'member-123',
            },
        } as unknown as Request<{
            commentUuid: string;
        }>;

        const res = createResponseMock();

        await controller.deleteComment(req, res);

        expect(deleteCommentUseCaseMock.execute).toHaveBeenCalledWith({
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
        });

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should get comments for the current user', async () => {
        const commentPage = {
            data: [],
            meta: {
                page: 2,
                size: 10,
                count: 0,
                total: 0,
                total_pages: 0,
            },
        };

        getUserCommentsUseCaseMock.execute.mockResolvedValue(commentPage);

        const req = {
            query: {
                page: 2,
                size: 10,
            },
            user: {
                memberCardUuid: 'member-123',
            },
        } as unknown as Request<
            Record<string, never>,
            unknown,
            unknown,
            CommentPaginationQuery
        >;

        const res = createResponseMock();

        await controller.getUserComments(req, res);

        expect(getUserCommentsUseCaseMock.execute).toHaveBeenCalledWith({
            page: 2,
            size: 10,
            memberCardUuid: 'member-123',
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: [],
            meta: {
                page: 2,
                size: 10,
                count: 0,
                total: 0,
                total_pages: 0,
            },
        });
    });

    it('should get comments for a chapter', async () => {
        const commentPage = {
            data: [],
            meta: {
                page: 1,
                size: 5,
                count: 0,
                total: 0,
                total_pages: 0,
            },
        };

        getChapterCommentsUseCaseMock.execute.mockResolvedValue(commentPage);

        const req = {
            params: {
                chapterUuid: 'chapter-123',
            },
            query: {
                page: 1,
                size: 5,
            },
        } as unknown as Request<
            { chapterUuid: string },
            unknown,
            unknown,
            CommentPaginationQuery
        >;

        const res = createResponseMock();

        await controller.getChapterComments(req, res);

        expect(getChapterCommentsUseCaseMock.execute).toHaveBeenCalledWith({
            page: 1,
            size: 5,
            chapterUuid: 'chapter-123',
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: [],
            meta: {
                page: 1,
                size: 5,
                count: 0,
                total: 0,
                total_pages: 0,
            },
        });
    });
});