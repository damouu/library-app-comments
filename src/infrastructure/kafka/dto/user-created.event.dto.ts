export interface UserCreatedEventDto {
    metadata: {
        timestamp: string;
        source_service: string;
        event_type: 'USER_CREATED';
        event_uuid: string;
    };

    data: {
        user_name: string;
        email: string;
        avatar_img_url: string | null;
        member_card_uuid: string;
    };
}