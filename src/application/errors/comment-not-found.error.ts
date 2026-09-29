import {ApplicationError} from "./application-error.js";

export class CommentNotFoundError extends ApplicationError {

    readonly code = "COMMENT_NOT_FOUND";
    readonly statusCode = 404;

    constructor() {
        super("Comment not found.");
    }
}