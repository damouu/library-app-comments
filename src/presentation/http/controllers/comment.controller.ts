import type {Request, Response} from "express";

import type {CreateCommentUseCase} from "../../../application/use-cases/create-comment.use-case.js";
import type {UpdateCommentUseCase} from "../../../application/use-cases/update-comment.use-case.js";
import type {DeleteCommentUseCase} from "../../../application/use-cases/delete-comment.use-case.js";
import type {GetUserCommentsUseCase} from "../../../application/use-cases/get-user-comments.use-case.js";
import type {GetChapterCommentsUseCase} from "../../../application/use-cases/get-chapter-comments.use-case.js";

import {mapCreateCommentRequest} from "../mappers/request/create-comment-request.mapper.js";
import {mapUpdateCommentRequest} from "../mappers/request/update-comment-request.mapper.js";
import {mapDeleteCommentRequest} from "../mappers/request/delete-comment-request.mapper.js";
import {mapGetCommentsRequest} from "../mappers/request/get-comments-request.mapper.js";
import {mapGetUserCommentsRequest} from "../mappers/request/get-user-comments-request.mapper.js";

import type {CommentPaginationQuery, CreateCommentBody, UpdateCommentBody} from "../types/comment-request.js";
import {mapToCommentCreatedResponse} from "../mappers/response/comment-response.mapper.js";
import {mapToChapterCommentResponse, mapToCommentPageResponse} from "../mappers/response/chapter-comment-response.mapper.js";
import {mapToUserCommentResponse} from "../mappers/response/user-comment-response.mapper.js";

export class CommentController {
    constructor(
        private readonly createCommentUseCase: CreateCommentUseCase,
        private readonly updateCommentUseCase: UpdateCommentUseCase,
        private readonly deleteCommentUseCase: DeleteCommentUseCase,
        private readonly getUserCommentsUseCase: GetUserCommentsUseCase,
        private readonly getChapterCommentsUseCase: GetChapterCommentsUseCase,
    ) {
    }

    /**
     * Creates a new comment for a Chapter.
     *
     * @param req - Express request containing chapterUuid in params and CreateCommentBody in body.
     * @param res - Express response object.
     * @return A 201 Created response containing the new comment payload
     */
    async createComment(req: Request<{ chapterUuid: string }, unknown, CreateCommentBody>, res: Response) {
        const dto = mapCreateCommentRequest(req);
        const commentEntity = await this.createCommentUseCase.execute(dto);
        const responsePayload = mapToCommentCreatedResponse(commentEntity);
        return res.status(201).json(responsePayload);
    }


    /**
     * Updates an existing comment for a Chapter.
     *
     * @param req - Express request containing commentUuid in params and UpdateCommentBody in body.
     * @param res - Express response object.
     * @return A 204 Created response.
     */
    async updateComment(req: Request<{
        commentUuid: string
    }, unknown, UpdateCommentBody>, res: Response): Promise<void> {
        const dto = mapUpdateCommentRequest(req);
        await this.updateCommentUseCase.execute(dto);
        res.status(204).send();
    }

    /**
     * Deletes an existing comment for a Chapter.
     *
     * @param req - Express request containing commentUuid in params.
     * @param res - Express response object.
     * @return A 204 Created response.
     */
    async deleteComment(req: Request<{ commentUuid: string }>, res: Response): Promise<void> {
        const dto = mapDeleteCommentRequest(req);
        await this.deleteCommentUseCase.execute(dto);
        res.status(204).send();
    }


    /**
     * Retrieves a paginated list of comments for a user.
     *
     * @param req - Express request containing the query params.
     * @param res - Express response used to send the CommentPage DTO.
     */
    async getUserComments(req: Request<Record<string, never>, unknown, unknown, CommentPaginationQuery>, res: Response): Promise<void> {
        const dto = mapGetUserCommentsRequest(req);
        const commentPage = await this.getUserCommentsUseCase.execute(dto);
        const responsePayload = mapToCommentPageResponse(commentPage, mapToUserCommentResponse);
        res.status(200).json(responsePayload);
    }


    /**
     * Retrieves a paginated list of comments for a specific chapter.
     *
     * @param req - Contains the `chapterUuid` in the URL parameters and pagination/sorting filters in the query string.
     * @param res - Sends a `200 OK` status with the paginated comment payload.
     */
    async getChapterComments(req: Request<{ chapterUuid: string }, unknown, unknown, CommentPaginationQuery>, res: Response): Promise<void> {
        const dto = mapGetCommentsRequest(req);
        const commentPage = await this.getChapterCommentsUseCase.execute(dto);
        const responsePayload = mapToCommentPageResponse(commentPage, mapToChapterCommentResponse);
        res.status(200).json(responsePayload);
    }
}