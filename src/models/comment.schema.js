import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    memberCardUuid: {
        type: String, required: true, index: true
    }, userName: {
        type: String, required: true,
    }, userEmail: {
        type: String, required: true,
    }, chapterUuid: {
        type: String, required: true, index: true
    }, commentUuid: {
        type: String, required: true, unique: true
    }, avatar_URL: {
        type: String, required: true,
    }, content: {
        type: String, required: true, trim: true,
    }, deletedAt: {type: Date, default: null},
}, {timestamps: true});

export const Comment = mongoose.model('Comment', commentSchema, 'comments');