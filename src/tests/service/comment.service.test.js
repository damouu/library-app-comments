import {jest} from '@jest/globals';

await jest.unstable_mockModule('../../repository/comment.repository.js', () => ({
    create: jest.fn(), update: jest.fn(), deleteComment: jest.fn(), findByUuid: jest.fn()
}));


const commentRepo = await import('../../repository/comment.repository.js');
const commentService = await import('../../services/comment.service.js');

describe('comment.service.saveComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls repository.create with correct arguments and returns result', async () => {
        const payload = {
            comment: 'Hello world', chapterUUID: '68e35d01-509f-4378-bf62-f4a8c8d58acb', user: {
                user_memberCardUUID: '68e35d01-509f-4378-bf62-f4a8c8d58acb',
                userName: 'Test User',
                userEmail: 'test@example.com',
                avatar_URL: 'https://example.com/avatar.png'
            }
        };

        const repoResult = {_id: 'mock-id', comment: 'Hello world'};

        commentRepo.create.mockResolvedValue(repoResult);

        const result = await commentService.saveComment(payload);

        expect(commentRepo.create).toHaveBeenCalledTimes(1);
        expect(result).toBe(repoResult);
    });
});


describe('comment.service.updateComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('successfully updates when user is the owner', async () => {
        const payload = {
            comment: 'Updated content',
            commentUuid: '68e35d01-509f-4378-bf62-f4a8c8d58acb',
            user_memberCardUUID: 'user-123'
        };


        commentRepo.findByUuid.mockResolvedValue({
            commentUuid: payload.commentUuid, memberCardUuid: 'user-123'
        });

        const repoResult = {success: true};
        commentRepo.update.mockResolvedValue(repoResult);

        const result = await commentService.updateComment(payload);

        expect(commentRepo.findByUuid).toHaveBeenCalledWith(payload.commentUuid);
        expect(commentRepo.update).toHaveBeenCalledWith(payload.comment, payload.commentUuid);
        expect(result).toBe(repoResult);
    });

    it('throws 403 when user is NOT the owner', async () => {
        const payload = {
            comment: 'Evil Update', commentUuid: 'comment-abc', user_memberCardUUID: 'hacker-id'
        };


        commentRepo.findByUuid.mockResolvedValue({
            commentUuid: 'comment-abc', memberCardUuid: 'victim-id'
        });

        await expect(commentService.updateComment(payload))
            .rejects
            .toThrow("Unauthorized");

        expect(commentRepo.update).not.toHaveBeenCalled();
    });
});


describe('comment.service.deleteComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if a user tries to delete a comment they do not own', async () => {
        const payload = {
            commentUuid: 'comment-123', user_memberCardUUID: 'user-hacker'
        };

        commentRepo.findByUuid.mockResolvedValue({
            commentUuid: 'comment-123', memberCardUuid: 'user-victim'
        });

        await expect(commentService.deleteComment(payload))
            .rejects
            .toThrow("Unauthorized");
    });
});