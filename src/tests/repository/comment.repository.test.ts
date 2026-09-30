import {afterAll, afterEach, beforeAll, describe, expect, it} from '@jest/globals';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

import {Comment} from '../../domain/comment.js';
import {MongoCommentRepository} from '../../infrastructure/repositories/mongo-comment.repository.js';
import {CommentModel} from '../../infrastructure/database/mongo/comment.schema.js';

describe('MongoCommentRepository', () => {
    let mongoServer: MongoMemoryServer;
    let repository: MongoCommentRepository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());

        repository = new MongoCommentRepository();
    });

    afterEach(async () => {
        await CommentModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    const createComment = (): Comment => {
        return Comment.create({
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
            chapterUuid: 'chapter-123',
            userName: 'John',
            userEmail: 'john@example.com',
            avatarUrl: null,
            content: 'Hello world',
        });
    };

    it('should save and retrieve a comment by uuid', async () => {
        const comment = createComment();

        await repository.save(comment);

        const result = await repository.findByUuid('comment-123');

        expect(result).not.toBeNull();
        expect(result?.commentUuid).toBe('comment-123');
        expect(result?.memberCardUuid).toBe('member-123');
        expect(result?.chapterUuid).toBe('chapter-123');
        expect(result?.userName).toBe('John');
        expect(result?.userEmail).toBe('john@example.com');
        expect(result?.avatarUrl).toBeNull();
        expect(result?.content).toBe('Hello world');
    });

    it('should return null when the comment does not exist', async () => {
        const result = await repository.findByUuid('unknown-comment');

        expect(result).toBeNull();
    });

    it('should update an existing comment', async () => {
        const comment = createComment();

        await repository.save(comment);

        comment.updateContent('Updated content');

        await repository.save(comment);

        const result = await repository.findByUuid('comment-123');

        expect(result).not.toBeNull();
        expect(result?.content).toBe('Updated content');
    });

    it('should not return a deleted comment', async () => {
        const comment = createComment();

        await repository.save(comment);

        comment.markAsDeleted();

        await repository.save(comment);

        const result = await repository.findByUuid('comment-123');

        expect(result).toBeNull();

        const document = await CommentModel.findOne({
            commentUuid: 'comment-123',
        }).exec();

        expect(document).not.toBeNull();
        expect(document?.deletedAt).toBeInstanceOf(Date);
    });
});