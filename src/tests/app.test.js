import request from 'supertest';
import express from 'express';
import {register, trackRequests} from '../utils/metrics.js';

const app = express();
app.use(trackRequests);

app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok'});
});

describe('Metrics Middleware', () => {
    beforeEach(() => {
        register.clear();
    });

    test('GET /health should return 200', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
    });
});