import {ApplicationError} from "./application-error.js";

export class CommentAccessDeniedError extends ApplicationError {

    readonly code = "COMMENT_ACCESS_DENIED";
    readonly statusCode = 403;

    constructor() {
        super("You don't have permission to access this comment.");
    }
}