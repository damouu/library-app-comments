import type {NextFunction, Request, Response} from "express";

import {ApplicationError} from "../../../application/errors/application-error.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction,): void {

    if (error instanceof ApplicationError) {
        res.status(error.statusCode).json({
            error: error.code,
            message: error.message,
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Internal server error.",
    });
}