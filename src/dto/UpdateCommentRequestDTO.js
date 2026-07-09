export class UpdateCommentRequestDTO {
    constructor(commentUuid, memberCardUuid, comment) {
        this.comment = comment;
        this.commentUuid = commentUuid;
        this.memberCardUuid = memberCardUuid;
    }
}