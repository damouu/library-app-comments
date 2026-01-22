import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    memberCardUuid: {
        type: mongoose.Schema.Types.UUID, required: true,
    }, chapterUuid: {
        type: mongoose.Schema.Types.UUID, required: true,
    }, avatar_URL: {
        type: String, required: true,
    }, content: {
        type: String, required: true, trim: true,
    }, createdAt: {
        type: Date, required: true,
    }, updatedAt: {
        type: Date, required: false,
    }, deletedAt: {type: Date, default: null},
}, {timestamps: true});

export const Comment = mongoose.model('Comment', commentSchema);