export interface CommentDocument {
    commentUuid: string;
    memberCardUuid: string;
    chapterUuid: string;
    userName: string;
    userEmail: string;
    avatarUrl: string | null;
    content: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}