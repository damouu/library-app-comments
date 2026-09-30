export interface CommentCreatedResponseDTO {
    props: {
        user_name: string;
        chapter_uuid: string;
        comment_uuid: string;
        avatar_url: string | null;
        content: string;
        deleted_at: Date | string | null;
        created_at: Date | string;
        updated_at: Date | string | null;
    };
}