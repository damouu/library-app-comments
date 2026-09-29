import "dotenv/config";

import {NodeSDK} from "@opentelemetry/sdk-node";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-grpc";

import {HttpInstrumentation} from "@opentelemetry/instrumentation-http";
import {ExpressInstrumentation} from "@opentelemetry/instrumentation-express";
import {MongoDBInstrumentation} from "@opentelemetry/instrumentation-mongodb";
import {KafkaJsInstrumentation} from "@opentelemetry/instrumentation-kafkajs";

const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
});

const sdk = new NodeSDK({
    traceExporter,

    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(),
        new KafkaJsInstrumentation(),
    ],
});

sdk.start();

const shutdown = async (): Promise<void> => {
    try {
        await sdk.shutdown();
    } catch (error) {
        console.error("Failed to shutdown OpenTelemetry:", error);
    } finally {
        process.exit(0);
    }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);