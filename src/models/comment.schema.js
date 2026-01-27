import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    memberCardUuid: {
        type: String, required: true,
    }, userName: {
        type: mongoose.Schema.Types.String, required: true,
    }, userEmail: {
        type: mongoose.Schema.Types.String, required: true,
    }, chapterUuid: {
        type: String, required: true,
    }, commentUuid: {
        type: String, required: true,
    }, avatar_URL: {
        type: mongoose.Schema.Types.String, required: true,
    }, content: {
        type: mongoose.Schema.Types.String, required: true, trim: true,
    }, deletedAt: {type: Date, default: null},
}, {timestamps: true});

export const Comment = mongoose.model('Comment', commentSchema);