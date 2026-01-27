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
    saveComment: jest.fn(), updateComment: jest.fn(),
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

});
