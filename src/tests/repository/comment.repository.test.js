import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import * as commentRepository from '../../repository/comment.repository.js';
import {Comment} from '../../models/comment.schema.js';
import {v4 as uuid4} from 'uuid';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Comment.deleteMany();
});


it('maps arguments correctly and saves a comment', async () => {
    const input = {
        comment: 'Hello repo',
        chapterUUID: uuid4(),
        memberCardUuid: uuid4(),
        userName: 'Repo User',
        userEmail: 'repo@example.com',
        avatar_URL: 'https://avatar.test/img.png',
    };

    const result = await commentRepository.create(input.comment, input.chapterUUID, input.memberCardUuid, input.userName, input.userEmail, input.avatar_URL);

    expect(result).toBe(true);

    const saved = await Comment.findOne();

    expect(saved).not.toBeNull();

    expect(saved.content).toBe(input.comment);
    expect(saved.chapterUuid).toBe(input.chapterUUID);
    expect(saved.memberCardUuid).toBe(input.memberCardUuid);
    expect(saved.userName).toBe(input.userName);
    expect(saved.userEmail).toBe(input.userEmail);
    expect(saved.avatar_URL).toBe(input.avatar_URL);

    expect(saved.commentUuid).toBeDefined();
});


describe('Comment Repository - update', () => {

    beforeEach(async () => {
        await Comment.deleteMany({});
    });

    it('should update the content of an existing comment and return true', async () => {
        const commentUuid = 'c26b8105-3686-4415-ae16-bf70c58f1b3d';
        await Comment.create({
            commentUuid: commentUuid,
            content: 'Original content',
            userName: 'Tester',
            userEmail: 'test@example.com',
            chapterUuid: 'chapter-123',
            memberCardUuid: 'card-123',
            avatar_URL: 'http://image.com'
        });

        const newContent = 'Updated content!';
        const result = await commentRepository.update(newContent, commentUuid);

        expect(result).toBe(true);


        const updatedDoc = await Comment.findOne({commentUuid});
        expect(updatedDoc.content).toBe(newContent);
    });

    it('should return true even if no document matches the filter', async () => {
        await expect(commentRepository.update('new content', 'non-existent-uuid'))
            .rejects
            .toThrow("Comment not found.");
    });
});


describe('Comment Repository - delete', () => {

    beforeEach(async () => {
        await Comment.deleteMany({});
    });

    it('should update the content of an existing comment and return true', async () => {
        const commentUuid = 'c26b8105-3686-4415-ae16-bf70c58f1b3d';
        await Comment.create({
            commentUuid: commentUuid,
            content: 'Original content',
            userName: 'Tester',
            userEmail: 'test@example.com',
            chapterUuid: 'chapter-123',
            memberCardUuid: 'card-123',
            avatar_URL: 'http://image.com'
        });

        const result = await commentRepository.deleteComment(commentUuid);

        expect(result).toBe(true);

        const deletedDoc = await Comment.findOne({commentUuid});

        expect(deletedDoc).not.toBeNull();
        expect(deletedDoc.deletedAt).toBeInstanceOf(Date);
        expect(deletedDoc.deletedAt).not.toBeNull();
    });

    it('should return true even if no document matches the filter', async () => {
        const commentUuid = 'c26b8105-3686-4415-ae16-bf70c58f1b3d';
        await expect(commentRepository.deleteComment(commentUuid))
            .rejects
            .toThrow("Comment not found.");
    });
});


describe('Comment Repository - findByUuid', () => {

    beforeEach(async () => {
        await Comment.deleteMany({});
    });

    it('should return the comment when it exists and is not deleted', async () => {
        const commentUuid = 'valid-uuid-123';
        await Comment.create({
            commentUuid,
            content: 'Hello World',
            userName: 'Tester',
            userEmail: 'test@test.com',
            chapterUuid: 'chap-1',
            memberCardUuid: 'user-1',
            avatar_URL: 'http://img.com',
            deletedAt: null
        });

        const result = await commentRepository.findByUuid(commentUuid);

        expect(result).not.toBeNull();
        expect(result.commentUuid).toBe(commentUuid);
        expect(result.content).toBe('Hello World');
    });
    

    it('should throw error if the UUID does not exist', async () => {
        await expect(commentRepository.findByUuid('non-existent-uuid'))
            .rejects
            .toThrow("Comment not found.");
    });

});