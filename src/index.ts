import "dotenv/config";
import mongoose from "mongoose";

import app from "./app.js";
import {createMemberConsumer} from "./bootstrap.js";

const port = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
        throw new Error("MONGODB_URI is not configured.");
    }

    await mongoose.connect(mongodbUri);

    const memberConsumer = createMemberConsumer();

    await memberConsumer.start();

    app.listen(port, () => {
        console.log(`Comments service listening on port ${port}`);
    });
}

try {
    await start();
} catch (error: unknown) {
    console.error("Failed to start comments service:", error);
    process.exit(1);
}