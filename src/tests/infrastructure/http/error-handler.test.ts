import {afterEach, describe, expect, it, jest} from '@jest/globals';
import type {NextFunction, Request, Response} from 'express';

import {errorHandler} from '../../../presentation/http/errors/error-handler.js';
import {CommentNotFoundError} from '../../../application/errors/comment-not-found.error.js';

describe('errorHandler', () => {
    const createResponseMock = (): Response => {
        const response = {
            status: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;

        (response.status as jest.Mock).mockReturnValue(response);

        return response;
    };

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle application errors', () => {
        const error = new CommentNotFoundError();

        const req = {} as Request;
        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(
            error.statusCode,
        );

        expect(res.json).toHaveBeenCalledWith({
            error: error.code,
            message: error.message,
        });
    });

    it('should return a 500 response for unexpected errors', () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        const error = new Error('Unexpected error');

        const req = {} as Request;
        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        errorHandler(error, req, res, next);

        expect(consoleErrorSpy).toHaveBeenCalledWith(error);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error.',
        });
    });
});