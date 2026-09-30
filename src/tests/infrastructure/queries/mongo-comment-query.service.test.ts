import {afterAll, afterEach, beforeAll, describe, expect, it,} from '@jest/globals';

import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

import {MongoCommentQueryService} from '../../../infrastructure/queries/mongo-comment-query.service.js';
import {CommentModel} from '../../../infrastructure/database/mongo/comment.schema.js';

describe('MongoCommentQueryService', () => {
    let mongoServer: MongoMemoryServer;
    let queryService: MongoCommentQueryService;

    const baseDate = new Date('2026-09-28T10:00:00.000Z');

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());

        queryService = new MongoCommentQueryService();
    });

    afterEach(async () => {
        await CommentModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return paginated comments for a user', async () => {
        await CommentModel.create([
            {
                commentUuid: 'comment-1',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-1',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'First comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 1000),
                updatedAt: new Date(baseDate.getTime() + 1000),
            },
            {
                commentUuid: 'comment-2',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-2',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'Second comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 2000),
                updatedAt: new Date(baseDate.getTime() + 2000),
            },
            {
                commentUuid: 'comment-3',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-3',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'Third comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 3000),
                updatedAt: new Date(baseDate.getTime() + 3000),
            },
            {
                commentUuid: 'comment-deleted',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-4',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'Deleted comment',
                deletedAt: new Date(),
                createdAt: new Date(baseDate.getTime() + 4000),
                updatedAt: new Date(baseDate.getTime() + 4000),
            },
            {
                commentUuid: 'comment-other-user',
                memberCardUuid: 'member-456',
                chapterUuid: 'chapter-5',
                userName: 'Jane',
                userEmail: 'jane@example.com',
                avatarUrl: null,
                content: 'Other user comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 5000),
                updatedAt: new Date(baseDate.getTime() + 5000),
            },
        ]);

        const result = await queryService.findByUser(
            1,
            2,
            'member-123',
        );

        expect(result.data).toHaveLength(2);

        expect(result.data[0]).toMatchObject({
            commentUuid: 'comment-3',
            chapterUuid: 'chapter-3',
            userName: 'John',
            content: 'Third comment',
        });

        expect(result.data[1]).toMatchObject({
            commentUuid: 'comment-2',
            chapterUuid: 'chapter-2',
            userName: 'John',
            content: 'Second comment',
        });

        expect(result.meta).toEqual({
            page: 1,
            size: 2,
            count: 2,
            total: 3,
            total_pages: 2,
        });
    });

    it('should return the second page of user comments', async () => {
        await CommentModel.create([
            {
                commentUuid: 'comment-1',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-1',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'First comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 1000),
                updatedAt: new Date(baseDate.getTime() + 1000),
            },
            {
                commentUuid: 'comment-2',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-2',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'Second comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 2000),
                updatedAt: new Date(baseDate.getTime() + 2000),
            },
            {
                commentUuid: 'comment-3',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-3',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: 'Third comment',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 3000),
                updatedAt: new Date(baseDate.getTime() + 3000),
            },
        ]);

        const result = await queryService.findByUser(
            2,
            2,
            'member-123',
        );

        expect(result.data).toHaveLength(1);
        expect(result.data[0].commentUuid).toBe('comment-1');

        expect(result.meta.page).toBe(2);
        expect(result.meta.size).toBe(2);
        expect(result.meta.count).toBe(1);
        expect(result.meta.total).toBe(3);
        expect(result.meta.total_pages).toBe(2);
    });

    it('should return paginated comments for a chapter', async () => {
        await CommentModel.create([
            {
                commentUuid: 'chapter-comment-1',
                memberCardUuid: 'member-1',
                chapterUuid: 'chapter-123',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: 'https://example.com/john.png',
                content: 'Chapter comment one',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 1000),
                updatedAt: new Date(baseDate.getTime() + 1000),
            },
            {
                commentUuid: 'chapter-comment-2',
                memberCardUuid: 'member-2',
                chapterUuid: 'chapter-123',
                userName: 'Jane',
                userEmail: 'jane@example.com',
                avatarUrl: null,
                content: 'Chapter comment two',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 2000),
                updatedAt: new Date(baseDate.getTime() + 2000),
            },
            {
                commentUuid: 'other-chapter',
                memberCardUuid: 'member-3',
                chapterUuid: 'chapter-456',
                userName: 'Bob',
                userEmail: 'bob@example.com',
                avatarUrl: null,
                content: 'Other chapter',
                deletedAt: null,
                createdAt: new Date(baseDate.getTime() + 3000),
                updatedAt: new Date(baseDate.getTime() + 3000),
            },
        ]);

        const result = await queryService.findByChapter(
            1,
            5,
            'chapter-123',
        );

        expect(result.data).toHaveLength(2);

        expect(result.data[0]).toMatchObject({
            commentUuid: 'chapter-comment-2',
            chapterUuid: 'chapter-123',
            userName: 'Jane',
            content: 'Chapter comment two',
        });

        expect(result.data[1]).toMatchObject({
            commentUuid: 'chapter-comment-1',
            chapterUuid: 'chapter-123',
            userName: 'John',
            content: 'Chapter comment one',
        });

        expect(result.meta).toEqual({
            page: 1,
            size: 5,
            count: 2,
            total: 2,
            total_pages: 1,
        });
    });

    it('should exclude deleted comments from chapter results', async () => {
        await CommentModel.create({
            commentUuid: 'deleted-chapter-comment',
            memberCardUuid: 'member-1',
            chapterUuid: 'chapter-123',
            userName: 'John',
            userEmail: 'john@example.com',
            avatarUrl: null,
            content: 'Deleted',
            deletedAt: new Date(),
            createdAt: baseDate,
            updatedAt: baseDate,
        });

        const result = await queryService.findByChapter(
            1,
            5,
            'chapter-123',
        );

        expect(result.data).toEqual([]);
        expect(result.meta.count).toBe(0);
        expect(result.meta.total).toBe(0);
        expect(result.meta.total_pages).toBe(0);
    });
});