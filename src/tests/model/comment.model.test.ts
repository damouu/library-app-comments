import {describe, expect, it} from '@jest/globals';

import {Comment} from '../../domain/comment.js';

describe('Comment', () => {
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

    it('should create a comment', () => {
        const comment = createComment();

        expect(comment.commentUuid).toBe('comment-123');
        expect(comment.memberCardUuid).toBe('member-123');
        expect(comment.chapterUuid).toBe('chapter-123');
        expect(comment.userName).toBe('John');
        expect(comment.userEmail).toBe('john@example.com');
        expect(comment.avatarUrl).toBeNull();
        expect(comment.content).toBe('Hello world');
        expect(comment.deletedAt).toBeNull();
        expect(comment.createdAt).toBeInstanceOf(Date);
        expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should reject empty content', () => {
        expect(() =>
            Comment.create({
                commentUuid: 'comment-123',
                memberCardUuid: 'member-123',
                chapterUuid: 'chapter-123',
                userName: 'John',
                userEmail: 'john@example.com',
                avatarUrl: null,
                content: '   ',
            }),
        ).toThrow("comment's content can not be empty.");
    });

    it('should update the content', () => {
        const comment = createComment();
        const previousUpdatedAt = comment.updatedAt;

        comment.updateContent('Updated content');

        expect(comment.content).toBe('Updated content');
        expect(comment.updatedAt.getTime()).toBeGreaterThanOrEqual(
            previousUpdatedAt.getTime(),
        );
    });

    it('should reject empty content when updating', () => {
        const comment = createComment();

        expect(() => comment.updateContent('   '))
            .toThrow("comment's content can not be empty.");
    });

    it('should mark the comment as deleted', () => {
        const comment = createComment();

        comment.markAsDeleted();

        expect(comment.deletedAt).toBeInstanceOf(Date);
        expect(comment.updatedAt).toBeInstanceOf(Date);
    });

    it('should reconstitute a comment', () => {
        const createdAt = new Date('2026-09-28T10:00:00.000Z');
        const updatedAt = new Date('2026-09-28T11:00:00.000Z');

        const comment = Comment.reconstitute({
            commentUuid: 'comment-123',
            memberCardUuid: 'member-123',
            chapterUuid: 'chapter-123',
            userName: 'John',
            userEmail: 'john@example.com',
            avatarUrl: null,
            content: 'Hello world',
            deletedAt: null,
            createdAt,
            updatedAt,
        });

        expect(comment.commentUuid).toBe('comment-123');
        expect(comment.content).toBe('Hello world');
        expect(comment.createdAt).toBe(createdAt);
        expect(comment.updatedAt).toBe(updatedAt);
    });
});