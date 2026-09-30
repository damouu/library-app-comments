import type {CommentRepository} from "../ports/comment-repository.js";
import type {CreateCommentDTO} from "../dto/create-comment.dto.js";
import {Comment} from "../../domain/comment.js";
import {v4 as uuid} from "uuid";
import type {MemberProjectionRepositoryPort} from "../ports/member-projection.repository.port.js";

export class CreateCommentUseCase {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly memberProjectionRepository: MemberProjectionRepositoryPort,
    ) {
    }

    async execute(dto: CreateCommentDTO): Promise<Comment> {
        const member =
            await this.memberProjectionRepository.findByMemberCardUuid(dto.memberCardUuid);

        if (!member) {
            throw new Error("Member projection not found.");
        }

        const comment = Comment.create({
            commentUuid: uuid(),
            memberCardUuid: member.memberCardUuid,
            userName: member.username,
            userEmail: member.email,
            avatarUrl: member.avatarUrl,
            chapterUuid: dto.chapterUuid,
            content: dto.content,
        });

        await this.commentRepository.save(comment);

        return comment;
    }
}