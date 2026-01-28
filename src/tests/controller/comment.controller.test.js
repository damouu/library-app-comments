import {jest} from '@jest/globals';
import request from 'supertest';

const VALID_UUID = '68e35d01-509f-4378-bf62-f4a8c8d58acb';

await jest.unstable_mockModule('../../middleware/auth.middleware.js', () => ({
    authMiddleware: (req, res, next) => {
        req.user = {
            user_memberCardUUID: VALID_UUID,
            userName: 'Test User',
            userEmail: 'test@example.com',
            avatar_URL: 'https://example.com/photo.jpg'
        };
        next();
    }
}));


await jest.unstable_mockModule('../../services/comment.service.js', () => ({
    saveComment: jest.fn(), updateComment: jest.fn(), deleteComment: jest.fn(), getUserComment: jest.fn()
}));


const commentService = await import('../../services/comment.service.js');
const {default: app} = await import('../../app.js');

describe('POST /api/chapter/:chapterUuid/comment', () => {

    it('creates a comment', async () => {
        commentService.saveComment.mockResolvedValueOnce({
            _id: 'mock-id', comment: 'Hello world', userName: 'Test User', chapterUUID: VALID_UUID
        });

        const res = await request(app)
            .post(`/api/chapter/${VALID_UUID}/comment`)
            .send({comment: 'Hello world'});

        expect(res.statusCode).toBe(201);
        expect(commentService.saveComment).toHaveBeenCalledTimes(1);
    });


    it('fails when service throws', async () => {
        commentService.saveComment.mockRejectedValueOnce(new Error('Database down'));

        const res = await request(app)
            .post(`/api/chapter/${VALID_UUID}/comment`)
            .send({comment: 'Hello world'});

        expect(res.statusCode).toBe(500);
    });

});


describe('PUT /api/comment/:commentUuid', () => {

    const updateData = {comment: 'New Content'};
    const commentUuid = 'test-uuid';

    it('updates a comment', async () => {
        commentService.updateComment.mockResolvedValueOnce({
            comment: 'update', commentUuid: VALID_UUID
        });

        const res = await request(app)
            .put(`/api/comment/${VALID_UUID}`)
            .send({comment: 'update!', commentUuid: VALID_UUID});

        expect(res.statusCode).toBe(204);
        expect(commentService.updateComment).toHaveBeenCalledTimes(1);
    });


    it('fails when service throws', async () => {
        commentService.updateComment.mockRejectedValueOnce(new Error('Database down'));

        const res = await request(app)
            .put(`/api/comment/${VALID_UUID}`)
            .send({comment: 'Hello world'});

        expect(res.statusCode).toBe(500);
    });

    it('should return 403 if service throws Unauthorized error', async () => {
        commentService.updateComment.mockRejectedValue(new Error("Unauthorized: You do not own this comment."));

        const res = await request(app)
            .put(`/api/comment/${commentUuid}`)
            .send(updateData);

        expect(res.status).toBe(403);
        expect(res.body.message).toContain("Unauthorized");
    });

    it('should return 404 if service throws Comment not found error', async () => {
        commentService.updateComment.mockRejectedValue(new Error("Comment not found."));

        const res = await request(app)
            .put(`/api/comment/${commentUuid}`)
            .send(updateData);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Comment not found.");
    });

});


describe('DELETE /api/comment/:commentUuid', () => {

    const commentUuid = 'test-uuid';
    const updateData = {comment: 'New Content'};

    it('delete a comment', async () => {
        commentService.deleteComment.mockResolvedValueOnce({
            commentUuid: VALID_UUID
        });

        const res = await request(app)
            .delete(`/api/comment/${VALID_UUID}`)
            .send({commentUuid: VALID_UUID});

        expect(res.statusCode).toBe(204);
        expect(commentService.deleteComment).toHaveBeenCalledTimes(1);
    });


    it('fails when service throws', async () => {
        commentService.deleteComment.mockRejectedValueOnce(new Error('Database down'));

        const res = await request(app)
            .delete(`/api/comment/${VALID_UUID}`)
            .send({commentUuid: VALID_UUID});

        expect(res.statusCode).toBe(500);
    });


    it('should return 403 if service throws Unauthorized error', async () => {
        await commentService.deleteComment.mockRejectedValue(new Error("Unauthorized: You do not own this comment."));

        const res = await request(app)
            .delete(`/api/comment/${commentUuid}`)
            .send(updateData);

        expect(res.status).toBe(403);
        expect(res.body.message).toContain("Unauthorized");
    });

    it('should return 404 if service throws Comment not found error', async () => {
        await commentService.deleteComment.mockRejectedValue(new Error("Comment not found."));

        const res = await request(app)
            .delete(`/api/comment/${commentUuid}`)
            .send(updateData);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Comment not found.");
    });

});


describe('Comment Controller - getUserComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the paginated comments', async () => {
        const mockResult = {
            comments: [{content: 'Test comment', commentUuid: 'uuid-1'}], pagination: {
                currentPage: 1, totalPages: 1, count: 1, total: 1
            }
        };

        commentService.getUserComment.mockResolvedValue(mockResult);

        const response = await request(app)
            .get('/api/user/comment')
            .query({page: 1, size: 5});

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockResult);

        expect(commentService.getUserComment).toHaveBeenCalledWith(1, 5, VALID_UUID);
    });

    it('should return 500 when service throws an error', async () => {
        commentService.getUserComment.mockRejectedValue(new Error('DB failure'));

        const response = await request(app).get('/api/user/comment');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Error fetching comments");
    });

    it('should use default pagination values if query params are missing', async () => {
        commentService.getUserComment.mockResolvedValue({comments: []});

        await request(app).get('/api/user/comment');


        expect(commentService.getUserComment).toHaveBeenCalledWith(1, 5, VALID_UUID);
    });
});
