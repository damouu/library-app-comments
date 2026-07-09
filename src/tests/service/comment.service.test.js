import {jest} from '@jest/globals';

await jest.unstable_mockModule('../../repository/comment.repository.js', () => ({
    create: jest.fn(),
    update: jest.fn(),
    deleteComment: jest.fn(),
    findByUuid: jest.fn(),
    findByUser: jest.fn(),
    findByChapter: jest.fn(),
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


describe('commentService.updateComment', () => {
    const commentUuid = '68e35d01-509f-4378-bf62-f4a8c8d58acb';
    const memberCardUuid = 'user-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('updates a comment when the authenticated user is the owner', async () => {

        const request = {
            comment: 'Updated content',
            commentUuid,
            memberCardUuid
        };

        commentRepo.findByUuid.mockResolvedValue({
            commentUuid,
            memberCardUuid
        });

        const updatedComment = { success: true };
        commentRepo.update.mockResolvedValue(updatedComment);

        const result = await commentService.updateComment(request);

        expect(commentRepo.findByUuid).toHaveBeenCalledWith(commentUuid);
        expect(commentRepo.update).toHaveBeenCalledWith(
            request.comment,
            commentUuid
        );

        expect(result).toBe(updatedComment);
    });

    it('throws an Unauthorized error when the authenticated user is not the owner', async () => {
        const request = {
            comment: 'Updated content',
            commentUuid,
            user_memberCardUUID: memberCardUuid
        };

        commentRepo.findByUuid.mockResolvedValue({
            commentUuid,
            memberCardUuid: 'another-user'
        });

        await expect(commentService.updateComment(request))
            .rejects
            .toThrow('Unauthorized');

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


describe('Comment Service - getUserComment', () => {
    const mockUser = 'user-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should clamp page and size to valid ranges', async () => {
        commentRepo.findByUser.mockResolvedValue({totalCount: 0});

        await commentService.getUserComment(-5, 100, mockUser);


        expect(commentRepo.findByUser).toHaveBeenCalledWith(1, 50, mockUser);
    });

    it('should return a standard empty structure if repository returns no results', async () => {
        commentRepo.findByUser.mockResolvedValue(null);

        const result = await commentService.getUserComment(1, 5, mockUser);

        expect(result).toEqual({
            comments: [], pagination: {
                currentPage: 1, totalPages: 0, count: 0, total: 0
            }
        });
    });

    it('should return the repository result if data exists', async () => {

        const repoData = {
            comments: [{content: 'Hello'}], totalCount: 1, totalPages: 1
        };
        commentRepo.findByUser.mockResolvedValue(repoData);


        const result = await commentService.getUserComment(1, 5, mockUser);

        expect(result).toBe(repoData);
        expect(commentRepo.findByUser).toHaveBeenCalledWith(1, 5, mockUser);
    });
});


describe('Comment Service - getComments', () => {
    const mockUser = 'user-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should clamp page and size to valid ranges', async () => {
        commentRepo.findByChapter.mockResolvedValue({totalCount: 0});

        await commentService.getComments(-5, 100, mockUser);


        expect(commentRepo.findByChapter).toHaveBeenCalledWith(1, 50, mockUser);
    });

    it('should return a standard empty structure if repository returns no results', async () => {
        commentRepo.findByChapter.mockResolvedValue(null);

        const result = await commentService.getComments(1, 5, mockUser);

        expect(result).toEqual({
            comments: [], pagination: {
                currentPage: 1, totalPages: 0, count: 0, total: 0
            }
        });
    });

    it('should return the repository result if data exists', async () => {

        const repoData = {
            comments: [{content: 'Hello'}], totalCount: 1, totalPages: 1
        };

        commentRepo.findByChapter.mockResolvedValue(repoData);

        const result = await commentService.getComments(1, 5, mockUser);

        expect(result).toBe(repoData);
        expect(commentRepo.findByChapter).toHaveBeenCalledWith(1, 5, mockUser);
    });
});



