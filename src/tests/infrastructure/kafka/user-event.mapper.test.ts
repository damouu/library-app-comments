import {describe, expect, it} from '@jest/globals';

import {mapUserCreatedEvent} from '../../../infrastructure/kafka/mapper/user-event.mapper.js';
import type {UserCreatedEventDto} from '../../../infrastructure/kafka/dto/user-created.event.dto.js';

describe('mapUserCreatedEvent', () => {
    it('should map a USER_CREATED event to member projection data', () => {
        const event: UserCreatedEventDto = {
            metadata: {
                timestamp: '2026-09-28T10:00:00.000Z',
                source_service: 'library-app-authentication-v2',
                event_type: 'USER_CREATED',
                event_uuid: 'event-123',
            },
            data: {
                user_name: 'John',
                email: 'john@example.com',
                avatar_img_url: null,
                member_card_uuid: 'member-123',
            },
        };

        const result = mapUserCreatedEvent(event);

        expect(result).toEqual({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });
    });

    it('should preserve the avatar URL', () => {
        const event: UserCreatedEventDto = {
            metadata: {
                timestamp: '2026-09-28T10:00:00.000Z',
                source_service: 'library-app-authentication-v2',
                event_type: 'USER_CREATED',
                event_uuid: 'event-123',
            },
            data: {
                user_name: 'John',
                email: 'john@example.com',
                avatar_img_url: 'https://example.com/avatar.png',
                member_card_uuid: 'member-123',
            },
        };

        const result = mapUserCreatedEvent(event);

        expect(result.avatarUrl).toBe(
            'https://example.com/avatar.png',
        );
    });
});