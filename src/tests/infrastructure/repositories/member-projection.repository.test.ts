import {afterAll, afterEach, beforeAll, describe, expect, it,} from '@jest/globals';

import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

import {MemberProjectionRepository} from '../../../infrastructure/repositories/member-projection.repository.js';
import {MemberProjectionModel} from '../../../infrastructure/database/mongo/member-projection.schema.js';

describe('MemberProjectionRepository', () => {
    let mongoServer: MongoMemoryServer;
    let repository: MemberProjectionRepository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(
            mongoServer.getUri(),
        );

        repository = new MemberProjectionRepository();
    });

    afterEach(async () => {
        await MemberProjectionModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create a member projection with upsert', async () => {
        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });

        const document = await MemberProjectionModel.findOne({
            member_card_uuid: 'member-123',
        }).exec();

        expect(document).not.toBeNull();
        expect(document?.member_card_uuid).toBe('member-123');
        expect(document?.user_name).toBe('John');
        expect(document?.email).toBe('john@example.com');
        expect(document?.avatar_img_url).toBeNull();
    });

    it('should update an existing projection when upsert is called again', async () => {
        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });

        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John Updated',
            email: 'updated@example.com',
            avatarUrl: 'https://example.com/avatar.png',
        });

        const documents = await MemberProjectionModel.find({
            member_card_uuid: 'member-123',
        }).exec();

        expect(documents).toHaveLength(1);
        expect(documents[0].user_name).toBe('John Updated');
        expect(documents[0].email).toBe('updated@example.com');
        expect(documents[0].avatar_img_url).toBe(
            'https://example.com/avatar.png',
        );
    });

    it('should find a member projection by member card uuid', async () => {
        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });

        const result =
            await repository.findByMemberCardUuid('member-123');

        expect(result).toEqual({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });
    });

    it('should return null when the projection does not exist', async () => {
        const result =
            await repository.findByMemberCardUuid('unknown-member');

        expect(result).toBeNull();
    });

    it('should update an existing projection', async () => {
        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });

        await repository.update({
            memberCardUuid: 'member-123',
            username: 'John Updated',
            email: 'updated@example.com',
        });

        const result =
            await repository.findByMemberCardUuid('member-123');

        expect(result?.username).toBe('John Updated');
        expect(result?.email).toBe('updated@example.com');
        expect(result?.avatarUrl).toBeNull();
    });

    it('should update only the provided fields', async () => {
        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: 'https://example.com/avatar.png',
        });

        await repository.update({
            memberCardUuid: 'member-123',
            username: 'John Updated',
        });

        const result =
            await repository.findByMemberCardUuid('member-123');

        expect(result).toEqual({
            memberCardUuid: 'member-123',
            username: 'John Updated',
            email: 'john@example.com',
            avatarUrl: 'https://example.com/avatar.png',
        });
    });

    it('should do nothing when there is no field to update', async () => {
        await repository.upsert({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });

        await repository.update({
            memberCardUuid: 'member-123',
        });

        const result =
            await repository.findByMemberCardUuid('member-123');

        expect(result).toEqual({
            memberCardUuid: 'member-123',
            username: 'John',
            email: 'john@example.com',
            avatarUrl: null,
        });
    });

    it('should throw when updating a projection that does not exist', async () => {
        await expect(
            repository.update({
                memberCardUuid: 'unknown-member',
                username: 'John',
            }),
        ).rejects.toThrow(
            'Member projection not found: unknown-member',
        );
    });
});