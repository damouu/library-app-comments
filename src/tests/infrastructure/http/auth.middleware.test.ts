import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import type {NextFunction, Request, Response} from 'express';
import type {JwtPayload} from 'jsonwebtoken';

const verifyMock = jest.fn<
    (
        token: string,
        publicKey: string,
        options: {
            algorithms: string[];
            issuer: string;
            audience: string;
        },
    ) => string | JwtPayload
>();

await jest.unstable_mockModule(
    'jsonwebtoken',
    () => ({
        default: {
            verify: verifyMock,
        },
    }),
);

await jest.unstable_mockModule(
    'node:fs',
    () => ({
        default: {
            readFileSync: jest.fn(() => 'TEST_PUBLIC_KEY'),
        },
    }),
);

process.env.PUBLIC_KEY_PATH = './test-public-key.pem';

const {authMiddleware} =
    await import('../../../presentation/http/middleware/auth.middleware.js');

describe('authMiddleware', () => {
    const createResponseMock = (): Response => {
        const response = {
            status: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;

        (response.status as jest.Mock).mockReturnValue(response);

        return response;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reject a request without a bearer token', () => {
        const req = {
            headers: {},
        } as Request;

        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Missing token',
        });

        expect(next).not.toHaveBeenCalled();
        expect(verifyMock).not.toHaveBeenCalled();
    });

    it('should reject an authorization header that is not Bearer', () => {
        const req = {
            headers: {
                authorization: 'Basic abc123',
            },
        } as Request;

        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Missing token',
        });

        expect(next).not.toHaveBeenCalled();
    });

    it('should reject an invalid token', () => {
        verifyMock.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const req = {
            headers: {
                authorization: 'Bearer invalid-token',
            },
        } as Request;

        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(verifyMock).toHaveBeenCalledWith(
            'invalid-token',
            'TEST_PUBLIC_KEY',
            {
                algorithms: ['RS256'],
                issuer: 'library-app-auth',
                audience: 'library-app-borrow',
            },
        );

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid or expired token',
        });

        expect(next).not.toHaveBeenCalled();
    });

    it('should reject a token with an invalid payload', () => {
        verifyMock.mockReturnValue(
            'invalid-payload',
        );

        const req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        } as Request;

        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid token payload',
        });

        expect(next).not.toHaveBeenCalled();
    });

    it('should reject a token without member_card_uuid', () => {
        verifyMock.mockReturnValue({});

        const req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        } as Request;

        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid token payload',
        });

        expect(next).not.toHaveBeenCalled();
    });

    it('should authenticate a valid user', () => {
        verifyMock.mockReturnValue({
            member_card_uuid: 'member-123',
        });

        const req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        } as Request & {
            user?: {
                memberCardUuid: string;
            };
        };

        const res = createResponseMock();
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(req.user).toEqual({
            memberCardUuid: 'member-123',
        });

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });
});