import express from "express";

import {register, trackRequests} from "./infrastructure/metrics/metrics.js";

import {errorHandler} from "./presentation/http/errors/error-handler.js";
import {createCommentRouter} from "./presentation/http/routes/comment.routes.js";

import {MongoCommentRepository} from "./infrastructure/repositories/mongo-comment.repository.js";
import {MongoCommentQueryService} from "./infrastructure/queries/mongo-comment-query.service.js";

import {CreateCommentUseCase} from "./application/use-cases/create-comment.use-case.js";
import {UpdateCommentUseCase} from "./application/use-cases/update-comment.use-case.js";
import {DeleteCommentUseCase} from "./application/use-cases/delete-comment.use-case.js";
import {GetUserCommentsUseCase} from "./application/use-cases/get-user-comments.use-case.js";
import {GetChapterCommentsUseCase} from "./application/use-cases/get-chapter-comments.use-case.js";
import {MemberProjectionRepository} from "./infrastructure/repositories/member-projection.repository.js";

import {CommentController} from "./presentation/http/controllers/comment.controller.js";


const commentRepository = new MongoCommentRepository();
const commentQueryService = new MongoCommentQueryService();
const memberProjectionRepository = new MemberProjectionRepository();


const createCommentUseCase = new CreateCommentUseCase(commentRepository, memberProjectionRepository);
const updateCommentUseCase = new UpdateCommentUseCase(commentRepository);
const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);
const getUserCommentsUseCase = new GetUserCommentsUseCase(commentQueryService);
const getChapterCommentsUseCase = new GetChapterCommentsUseCase(commentQueryService);


const commentController = new CommentController(createCommentUseCase, updateCommentUseCase, deleteCommentUseCase, getUserCommentsUseCase, getChapterCommentsUseCase);

const commentRouter = createCommentRouter(commentController);

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.get("/metrics", async (_req, res, next) => {
    try {
        res.setHeader("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (error: unknown) {
        next(error);
    }
});


app.use(trackRequests);

app.use("/api/comment", commentRouter);
app.use(errorHandler);

export default app;