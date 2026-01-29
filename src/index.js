import express from "express";
import mongoose from "mongoose";
import commentRouter from "./routes/comment.routes.js";
import dotenv from 'dotenv';
import {register, trackRequests} from "./utils/metrics.js";
import app from './app.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DATABASE

}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB error:", err));

app.use(express.json());
app.use(trackRequests);
app.use('/api/', commentRouter);

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});