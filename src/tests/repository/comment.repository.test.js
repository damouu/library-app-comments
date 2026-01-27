import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { create } from '../../repository/comment.repository.js';
import { Comment } from '../../models/comment.schema.js';
import {v4 as uuid4} from 'uuid';

const VALID_UUID = 'c26b8105-3686-4415-ae16-bf70c58f1b3d';
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Comment.deleteMany();
});


it('maps arguments correctly and saves a comment', async () => {
    const input = {
        comment: 'Hello repo',
        chapterUUID: uuid4(),
        memberCardUuid: uuid4(),
        userName: 'Repo User',
        userEmail: 'repo@example.com',
        avatar_URL: 'https://avatar.test/img.png',
    };

    const result = await create(
        input.comment,
        input.chapterUUID,
        input.memberCardUuid,
        input.userName,
        input.userEmail,
        input.avatar_URL
    );

    expect(result).toBe(true);

    const saved = await Comment.findOne();

    expect(saved).not.toBeNull();

    expect(saved.content).toBe(input.comment);
    expect(saved.chapterUuid).toBe(input.chapterUUID);
    expect(saved.memberCardUuid).toBe(input.memberCardUuid);
    expect(saved.userName).toBe(input.userName);
    expect(saved.userEmail).toBe(input.userEmail);
    expect(saved.avatar_URL).toBe(input.avatar_URL);

    expect(saved.commentUuid).toBeDefined();
});
