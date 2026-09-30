import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import {MemberProjectionService} from '../../../application/projection/member-projection.service.js';
import type {MemberProjectionRepositoryPort} from '../../../application/ports/member-projection.repository.port.js';
import type {MemberProjectionData} from '../../../application/projection/dto/member-projection-data.js';
import type {MemberProjectionUpdateData} from '../../../application/projection/dto/member-projection-update-data.js';

describe('MemberProjectionService', () => {
    const repositoryMock: jest.Mocked<MemberProjectionRepositoryPort> = {
        upsert: jest.fn(),
        update: jest.fn(),
        findByMemberCardUuid: jest.fn(),
    };

    let service: MemberProjectionService;

    beforeEach(() => {
        jest.clearAllMocks();

        service = new MemberProjectionService(repositoryMock);
    });

    it('should create or replace a member projection', async () => {
        const data: MemberProjectionData = {
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        };

        await service.handleCreated(data);

        expect(repositoryMock.upsert).toHaveBeenCalledWith(data);
        expect(repositoryMock.upsert).toHaveBeenCalledTimes(1);
    });

    it('should update a member projection', async () => {
        const data: MemberProjectionUpdateData = {
            memberCardUuid: 'member-123',
            username: 'John Updated',
            email: 'john.updated@example.com',
            avatarUrl: 'https://example.com/avatar.png',
        };

        await service.handleUpdated(data);

        expect(repositoryMock.update).toHaveBeenCalledWith(data);
        expect(repositoryMock.update).toHaveBeenCalledTimes(1);
    });
});