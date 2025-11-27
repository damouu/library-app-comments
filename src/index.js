import express from "express";
import mongoose from "mongoose";

const app = express();
const uri = process.env.MONGO_URI; // from docker-compose

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));

app.get("/api/status", (req, res) => {
    res.json({status: "OK", time: new Date()});
});