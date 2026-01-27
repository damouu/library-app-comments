import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Comment} from '../../models/comment.schema.js';
import {v4 as uuidv4} from 'uuid';

let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

afterEach(async () => {
    await Comment.deleteMany();
});

it('saves a valid comment', async () => {
    const comment = new Comment({
        memberCardUuid: uuidv4(),
        userName: 'Test User',
        userEmail: 'test@example.com',
        chapterUuid: uuidv4(),
        commentUuid: uuidv4(),
        avatar_URL: 'https://example.com/avatar.png',
        content: '   Hello world   '
    });

    const saved = await comment.save();

    expect(saved._id).toBeDefined();
    expect(saved.content).toBe('Hello world');
    expect(saved.userName).toBe('Test User');
    expect(saved.userEmail).toBe('test@example.com');
    expect(saved.avatar_URL).toBe('https://example.com/avatar.png');
    expect(saved.content).toBe('Hello world');
    expect(saved.createdAt).toBeDefined();
    expect(saved.updatedAt).toBeDefined();
    expect(saved.deletedAt).toBeNull();
});


