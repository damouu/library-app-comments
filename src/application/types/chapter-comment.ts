export interface ChapterComment {
    commentUuid: string;
    chapterUuid: string;
    userName: string;
    avatarUrl: string | null;
    content: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}