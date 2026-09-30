import jwt, {type JwtPayload} from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

import type {NextFunction, Request, Response,} from "express";

dotenv.config();

const publicKeyPath = process.env.PUBLIC_KEY_PATH;

if (!publicKeyPath) {
    throw new Error("PUBLIC_KEY_PATH is not configured.");
}

const publicKey = fs.readFileSync(path.resolve(publicKeyPath), "utf8");

/**
 * Validates that the JWT payload contains the required user claims.
 *
 * @param req
 * @param res
 * @param next
 */
function isAuthenticatedUser(payload: string | JwtPayload): payload is JwtPayload & { member_card_uuid: string } {
    return (
        typeof payload !== "string" &&
        typeof payload.member_card_uuid === "string"
    );
}

/**
 * Verifies the RS256 Bearer Token and attaches the user's UUID to the request
 *
 * @param req
 * @param res
 * @param next
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Missing token",
        });

        return;
    }

    const token = authHeader.slice("Bearer ".length);

    try {
        const payload = jwt.verify(token, publicKey, {
            algorithms: ["RS256"],
            issuer: "library-app-auth",
            audience: "library-app-borrow",
        });

        if (!isAuthenticatedUser(payload)) {
            res.status(401).json({
                message: "Invalid token payload",
            });

            return;
        }

        req.user = {memberCardUuid: payload.member_card_uuid};

        next();
    } catch {
        res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}