export interface MemberUpdatedEventDto {
    eventId: string;
    eventType: 'MEMBER_UPDATED';
    occurredAt: string;
    data: {
        memberCardUuid: string;
        username?: string;
        email?: string;
        avatarUrl?: string | null;
    };
}