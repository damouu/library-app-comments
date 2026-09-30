export interface ChapterCommentResponseDTO {
    comment_uuid: string;
    chapter_uuid: string;
    user_name: string;
    avatar_url: string | null;
    content: string;
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at: Date | string | null;
}