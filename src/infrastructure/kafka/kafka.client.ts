import {Kafka} from 'kafkajs';
import fs from 'node:fs';

const brokers = process.env.KAFKA_BROKERS?.split(',') ?? [];

const ca = process.env.KAFKA_CA_PATH ? [fs.readFileSync(process.env.KAFKA_CA_PATH, 'utf-8')] : undefined;

export const kafka = new Kafka({
    clientId: 'comment-group', brokers,
    ssl: {
        ca,
    },

    sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
    },
});