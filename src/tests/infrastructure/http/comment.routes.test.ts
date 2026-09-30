import {describe, expect, it, jest} from '@jest/globals';
import type {NextFunction, Request, Response} from 'express';

const authMiddlewareMock = jest.fn(
    (_req: Request, _res: Response, next: NextFunction) => {
        next();
    },
);

await jest.unstable_mockModule(
    '../../../presentation/http/middleware/auth.middleware.js',
    () => ({
        authMiddleware: authMiddlewareMock,
    }),
);

const {createCommentRouter} =
    await import(
        '../../../presentation/http/routes/comment.routes.js'
        );

describe('createCommentRouter', () => {
    it('should register all comment routes', () => {
        const controllerMock = {
            createComment: jest.fn(),
            updateComment: jest.fn(),
            deleteComment: jest.fn(),
            getUserComments: jest.fn(),
            getChapterComments: jest.fn(),
        };

        const router = createCommentRouter(
            controllerMock as never,
        );

        const stack = (
            router as unknown as {
                stack: Array<{
                    route?: {
                        path: string;
                        methods: Record<string, boolean>;
                        stack: Array<{
                            handle: unknown;
                        }>;
                    };
                }>;
            }
        ).stack;

        const routes = stack
            .map(layer => layer.route)
            .filter(
                (
                    route,
                ): route is NonNullable<typeof route> =>
                    route !== undefined,
            );

        expect(routes).toHaveLength(5);

        expect(
            routes.some(
                route =>
                    route.path === '/chapter/:chapterUuid' &&
                    route.methods.post,
            ),
        ).toBe(true);

        expect(
            routes.some(
                route =>
                    route.path === '/:commentUuid' &&
                    route.methods.put,
            ),
        ).toBe(true);

        expect(
            routes.some(
                route =>
                    route.path === '/:commentUuid' &&
                    route.methods.delete,
            ),
        ).toBe(true);

        expect(
            routes.some(
                route =>
                    route.path === '/user' &&
                    route.methods.get,
            ),
        ).toBe(true);

        expect(
            routes.some(
                route =>
                    route.path === '/public/chapter/:chapterUuid' &&
                    route.methods.get,
            ),
        ).toBe(true);
    });

    it('should protect the authenticated routes with authMiddleware', () => {
        const controllerMock = {
            createComment: jest.fn(),
            updateComment: jest.fn(),
            deleteComment: jest.fn(),
            getUserComments: jest.fn(),
            getChapterComments: jest.fn(),
        };

        const router = createCommentRouter(
            controllerMock as never,
        );

        const stack = (
            router as unknown as {
                stack: Array<{
                    route?: {
                        path: string;
                        stack: Array<{
                            handle: unknown;
                        }>;
                    };
                }>;
            }
        ).stack;

        const routes = stack
            .map(layer => layer.route)
            .filter(
                (
                    route,
                ): route is NonNullable<typeof route> =>
                    route !== undefined,
            );

        const protectedPaths = [
            '/chapter/:chapterUuid',
            '/:commentUuid',
            '/user',
        ];

        for (const path of protectedPaths) {
            const route = routes.find(
                item => item.path === path,
            );

            expect(route).toBeDefined();
            expect(
                route?.stack.some(
                    layer =>
                        layer.handle === authMiddlewareMock,
                ),
            ).toBe(true);
        }
    });

    it('should leave public chapter comments unprotected', () => {
        const controllerMock = {
            createComment: jest.fn(),
            updateComment: jest.fn(),
            deleteComment: jest.fn(),
            getUserComments: jest.fn(),
            getChapterComments: jest.fn(),
        };

        const router = createCommentRouter(
            controllerMock as never,
        );

        const stack = (
            router as unknown as {
                stack: Array<{
                    route?: {
                        path: string;
                        stack: Array<{
                            handle: unknown;
                        }>;
                    };
                }>;
            }
        ).stack;

        const route = stack
            .map(layer => layer.route)
            .find(
                item =>
                    item?.path ===
                    '/public/chapter/:chapterUuid',
            );

        expect(route).toBeDefined();

        expect(
            route?.stack.some(
                layer => layer.handle === authMiddlewareMock,
            ),
        ).toBe(false);
    });
});