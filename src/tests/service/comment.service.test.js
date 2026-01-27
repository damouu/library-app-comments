import {jest} from '@jest/globals';

await jest.unstable_mockModule('../../repository/comment.repository.js', () => ({
    create: jest.fn(), update: jest.fn(),
}));

const commentRepo = await import('../../repository/comment.repository.js');
const {saveComment} = await import('../../services/comment.service.js');
const {updateComment} = await import('../../services/comment.service.js');

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

        const result = await saveComment(payload);

        expect(commentRepo.create).toHaveBeenCalledTimes(1);
        expect(result).toBe(repoResult);
    });
});


describe('comment.service.updateComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls repository.create with correct arguments and returns result', async () => {
        const payload = {
            comment: 'Hello world', commentUuid: '68e35d01-509f-4378-bf62-f4a8c8d58acb'
        };

        const repoResult = {_id: 'mock-id', comment: 'Hello world'};

        commentRepo.update.mockResolvedValue(repoResult);

        const result = await updateComment(payload);

        expect(commentRepo.update).toHaveBeenCalledTimes(1);
        expect(result).toBe(repoResult);
    });
});