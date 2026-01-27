import { jest } from '@jest/globals';

const createMock = jest.fn();

await jest.unstable_mockModule('../../repository/comment.repository.js', () => ({
    create: createMock
}));

const { saveComment } = await import('../../services/comment.service.js');

describe('comment.service.saveComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls repository.create with correct arguments and returns result', async () => {
        const payload = {
            comment: 'Hello world',
            chapterUUID: 'chapter-uuid',
            memberCardUuid: 'member-uuid',
            userName: 'Test User',
            userEmail: 'test@example.com',
            avatar_URL: 'https://example.com/avatar.png'
        };

        const repoResult = {
            _id: 'mock-id',
            content: 'Hello world'
        };

        createMock.mockResolvedValue(repoResult);

        const result = await saveComment(payload);

        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith(
            payload.comment,
            payload.chapterUUID,
            payload.memberCardUuid,
            payload.userName,
            payload.userEmail,
            payload.avatar_URL
        );

        expect(result).toBe(repoResult);
    });
});
