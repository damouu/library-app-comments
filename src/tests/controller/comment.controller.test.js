import {jest} from '@jest/globals';
import request from 'supertest';

const VALID_UUID = 'c26b8105-3686-4415-ae16-bf70c58f1b3d';

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
    saveComment: jest.fn()
}));

const {saveComment} = await import('../../services/comment.service.js');
const {default: app} = await import('../../app.js');

describe('POST /api/chapter/:chapterUuid/comment', () => {

    it('creates a comment', async () => {
        saveComment.mockResolvedValueOnce({
            _id: 'mock-id', comment: 'Hello world', userName: 'Test User', chapterUUID: VALID_UUID
        });

        const res = await request(app)
            .post(`/api/chapter/${VALID_UUID}/comment`)
            .send({comment: 'Hello world'});

        expect(res.statusCode).toBe(201);
        expect(saveComment).toHaveBeenCalledTimes(1);
    });


    it('fails when service throws', async () => {
        saveComment.mockRejectedValueOnce(new Error('Database down'));

        const res = await request(app)
            .post(`/api/chapter/${VALID_UUID}/comment`)
            .send({comment: 'Hello world'});

        expect(res.statusCode).toBe(500);
    });

});
