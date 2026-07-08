export class CreateCommentDTO {
    constructor(
        content,
        chapterUuid,
        memberCardUuid,
        userName,
        userEmail,
        avatarUrl
    ) {
        this.content = content;
        this.chapterUuid = chapterUuid;
        this.memberCardUuid = memberCardUuid;
        this.userName = userName;
        this.userEmail = userEmail;
        this.avatar_URL = avatarUrl;
    }
}