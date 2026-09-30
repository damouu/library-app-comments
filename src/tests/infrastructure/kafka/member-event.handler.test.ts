import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import {MemberEventHandler} from '../../../infrastructure/kafka/handlers/member-event.handler.js';
import type {MemberProjectionService} from '../../../application/projection/member-projection.service.js';
import type {UserCreatedEventDto} from '../../../infrastructure/kafka/dto/user-created.event.dto.js';

describe('MemberEventHandler', () => {
    const projectionServiceMock = {
        handleCreated: jest.fn(),
        handleUpdated: jest.fn(),
    } as unknown as jest.Mocked<MemberProjectionService>;

    let handler: MemberEventHandler;

    const createUserCreatedEvent = (): UserCreatedEventDto => ({
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
    });

    beforeEach(() => {
        jest.clearAllMocks();

        handler = new MemberEventHandler(
            projectionServiceMock,
        );
    });

    it('should handle USER_CREATED events', async () => {
        const event = createUserCreatedEvent();

        await handler.handle(event);

        expect(projectionServiceMock.handleCreated).toHaveBeenCalledWith({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });

        expect(projectionServiceMock.handleCreated).toHaveBeenCalledTimes(1);
    });

    it('should propagate projection errors', async () => {
        const event = createUserCreatedEvent();

        const error = new Error('Projection failed');

        projectionServiceMock.handleCreated.mockRejectedValue(error);

        await expect(handler.handle(event)).rejects.toThrow(
            'Projection failed',
        );
    });
});