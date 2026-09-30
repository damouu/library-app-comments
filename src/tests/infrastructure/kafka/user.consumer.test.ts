import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import type {Consumer, EachMessagePayload} from 'kafkajs';

import type {UserEventDto} from '../../../infrastructure/kafka/dto/user.event.dto.js';

type UserEventHandler = (event: UserEventDto) => Promise<void>;

type RunConfig = {
    eachMessage: (payload: EachMessagePayload) => Promise<void>;
};

type ConsumerFactory = (config: {
    groupId: string;
}) => Consumer;

const connectMock = jest.fn<() => Promise<void>>();
const subscribeMock = jest.fn<
    (config: { topic: string; fromBeginning?: boolean }) => Promise<void>
>();
const runMock = jest.fn<(config: RunConfig) => Promise<void>>();
const disconnectMock = jest.fn<() => Promise<void>>();

const consumerMock = {
    connect: connectMock,
    subscribe: subscribeMock,
    run: runMock,
    disconnect: disconnectMock,
} as unknown as Consumer;

const kafkaConsumerMock = jest.fn<ConsumerFactory>(
    () => consumerMock,
);

const eventHandlerMock = jest.fn<UserEventHandler>();

await jest.unstable_mockModule(
    '../../../infrastructure/kafka/kafka.client.js',
    () => ({
        kafka: {
            consumer: kafkaConsumerMock,
        },
    }),
);

const {UserConsumer} =
    await import(
        '../../../infrastructure/kafka/consumers/user.consumer.js'
        );

describe('UserConsumer', () => {
    const createEvent = (): UserEventDto => ({
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

        connectMock.mockResolvedValue(undefined);
        subscribeMock.mockResolvedValue(undefined);
        disconnectMock.mockResolvedValue(undefined);
        eventHandlerMock.mockResolvedValue(undefined);

        runMock.mockImplementation(
            async ({eachMessage}: RunConfig) => {
                await eachMessage({
                    topic: 'auth-create-topic',
                    partition: 0,
                    message: {
                        value: Buffer.from(
                            JSON.stringify(createEvent()),
                        ),
                    },
                } as EachMessagePayload);
            },
        );
    });

    it('should connect and subscribe to the Kafka topic', async () => {
        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await consumer.start();

        expect(kafkaConsumerMock).toHaveBeenCalledWith({
            groupId: expect.any(String),
        });

        expect(connectMock).toHaveBeenCalledTimes(1);

        expect(subscribeMock).toHaveBeenCalledWith({
            topic: expect.any(String),
            fromBeginning: true,
        });

        expect(runMock).toHaveBeenCalledTimes(1);
    });


    it('should ignore unsupported event types', async () => {
        const unsupportedEvent = {
            ...createEvent(),
            metadata: {
                ...createEvent().metadata,
                event_type: 'USER_UPDATED',
            },
        };

        runMock.mockImplementation(
            async ({eachMessage}: RunConfig) => {
                await eachMessage({
                    topic: 'auth-create-topic',
                    partition: 0,
                    message: {
                        value: Buffer.from(
                            JSON.stringify(unsupportedEvent),
                        ),
                    },
                } as EachMessagePayload);
            },
        );

        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await consumer.start();

        expect(eventHandlerMock).not.toHaveBeenCalled();
    });

    it('should propagate handler errors', async () => {
        const error = new Error('Handler failed');

        eventHandlerMock.mockRejectedValue(error);

        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await expect(
            consumer.start(),
        ).rejects.toThrow('Handler failed');
    });

    it('should pass a USER_CREATED event to the handler', async () => {
        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await consumer.start();

        expect(eventHandlerMock).toHaveBeenCalledWith(
            createEvent(),
        );

        expect(eventHandlerMock).toHaveBeenCalledTimes(1);
    });

    it('should ignore empty Kafka messages', async () => {
        runMock.mockImplementation(
            async ({eachMessage}: RunConfig) => {
                await eachMessage({
                    topic: 'auth-create-topic',
                    partition: 0,
                    message: {
                        value: null,
                    },
                } as EachMessagePayload);
            },
        );

        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await consumer.start();

        expect(eventHandlerMock).not.toHaveBeenCalled();
    });

    it('should ignore malformed JSON messages', async () => {
        runMock.mockImplementation(
            async ({eachMessage}: RunConfig) => {
                await eachMessage({
                    topic: 'auth-create-topic',
                    partition: 0,
                    message: {
                        value: Buffer.from('invalid-json'),
                    },
                } as EachMessagePayload);
            },
        );

        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await consumer.start();

        expect(eventHandlerMock).not.toHaveBeenCalled();
    });

    it('should disconnect from Kafka when stopped', async () => {
        const consumer = new UserConsumer(
            eventHandlerMock,
        );

        await consumer.stop();

        expect(disconnectMock).toHaveBeenCalledTimes(1);
    });
});