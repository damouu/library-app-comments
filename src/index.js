import express from "express";
import mongoose from "mongoose";
import commentRouter from "./routes/comment.routes.js";

import {register, trackRequests} from "./utils/metrics.js";

const app = express();
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB error:", err));

app.use('/api/comment', commentRouter);
app.use(trackRequests);

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.listen(3000, () => console.log("Server running on port 3000"));