import {Comment} from "../models/comment.schema.js";
import {v4 as uuid4} from 'uuid';

export const create = async (comment, chapterUUID, memberCardUuid, userName, userEmail, avatar_URL) => {
    const userComment = new Comment({
        memberCardUuid: memberCardUuid,
        chapterUuid: chapterUUID,
        userName: userName,
        userEmail: userEmail,
        avatar_URL: avatar_URL,
        commentUuid: uuid4(),
        content: comment,
    })

    await userComment.save();

    return true
}


export const update = async (comment, commentUuid) => {

    try {

        const filter = {commentUuid: commentUuid};
        const update = {content: comment};

        const doc = await Comment.findOneAndUpdate(filter, update);

        if (!doc) {
            throw new Error("Comment not found.");
        }
        return true;
    } catch (e) {
        console.error("DB Error:", e);
        throw e;
    }

};


export const findByUuid = async (commentUuid) => {
    try {
        const filter = {commentUuid: commentUuid, deletedAt: null};
        const response = await Comment.findOne(filter).exec();

        if (!response) {
            throw new Error("Comment not found.");
        }

        return response;
    } catch (e) {
        console.error("DB Error:", e);
        throw e;
    }
}


export const deleteComment = async (commentUuid) => {

    try {

        const filter = {commentUuid: commentUuid};
        const update = {deletedAt: Date.now()};

        const doc = await Comment.findOneAndUpdate(filter, update);

        if (!doc) {
            throw new Error("Comment not found.....");
        }
        return true;
    } catch (e) {
        console.error("DB Error:", e);
        throw e;
    }

};