import type {Consumer, EachMessagePayload} from 'kafkajs';

import {kafka} from '../kafka.client.js';

import type {UserEventDto} from '../dto/user.event.dto.js';

export type UserEventHandler = (event: UserEventDto) => Promise<void>;

const TOPIC = process.env.KAFKA_MEMBER_EVENTS_TOPIC ?? 'auth-create-topic';

const GROUP_ID = process.env.KAFKA_MEMBER_EVENTS_GROUP_ID ?? 'comment-group';

export class UserConsumer {

    private readonly consumer: Consumer;

    constructor(private readonly eventHandler: UserEventHandler) {
        this.consumer = kafka.consumer({
            groupId: GROUP_ID,
        });
    }

    async start(): Promise<void> {

        await this.consumer.connect();

        await this.consumer.subscribe({
            topic: TOPIC,
            fromBeginning: true,
        });

        await this.consumer.run({
            eachMessage: async (payload) => {
                await this.handleMessage(payload);
            },
        });

        console.log(
            `[UserConsumer] Listening to topic "${TOPIC}"`,
        );
    }

    private async handleMessage({topic, partition, message}: EachMessagePayload): Promise<void> {

        if (!message.value) {
            console.warn(
                `[UserConsumer] Ignoring empty message ` +
                `from ${topic}[${partition}]`,
            );

            return;
        }

        let event: UserEventDto;

        try {
            event = JSON.parse(
                message.value.toString(),
            ) as UserEventDto;
        } catch (error) {
            console.error('[UserConsumer] Failed to deserialize Kafka message', error);

            return;
        }

        if (!this.isSupportedEvent(event)) {
            console.warn(`[UserConsumer] Unsupported event type: ${event.metadata.event_type}`);

            return;
        }

        try {
            await this.eventHandler(event);

            console.log(
                `[UserConsumer] Processed ${event.metadata.event_type} ` +
                `(eventId=${event.metadata.event_uuid})`,
            );
        } catch (error) {
            console.error(
                `[UserConsumer] Failed to process ` +
                `${event.metadata.event_type} ` +
                `(eventId=${event.metadata.event_uuid})`,
                error,
            );

            throw error;
        }
    }

    private isSupportedEvent(event: UserEventDto): boolean {
        return event.metadata.event_type === 'USER_CREATED';
    }

    async stop(): Promise<void> {
        await this.consumer.disconnect();

        console.log('[UserConsumer] Disconnected');
    }
}