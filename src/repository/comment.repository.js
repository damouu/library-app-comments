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


export const findByUser = async (validatedPage, validatedSize, memberCardUUID) => {

    try {

        const skip = (validatedPage - 1) * validatedSize;

        const filter = {memberCardUuid: memberCardUUID, deletedAt: null};

        const [comments, total] = await Promise.all([Comment.find(filter)
            .select('-__v -memberCardUuid -_id -userName -userEmail -avatar_URL')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(validatedSize)
            .exec(), Comment.countDocuments(filter)]);

        return {
            data: comments, meta: {
                Page: validatedPage, Size: validatedSize, count: comments.length, total: total
            }
        }

    } catch (e) {
        console.error("DB Error:", e);
        throw e;
    }
};


export const findByChapter = async (validatedPage, validatedSize, chapterUuid) => {

    try {

        const skip = (validatedPage - 1) * validatedSize;

        const filter = {chapterUuid: chapterUuid, deletedAt: null};

        const [comments, total] = await Promise.all([Comment.find(filter)
            .select('-__v -memberCardUuid -_id -userName -userEmail -avatar_URL')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(validatedSize)
            .exec(), Comment.countDocuments(filter)]);

        return {
            data: comments, meta: {
                Page: validatedPage, Size: validatedSize, count: comments.length, total: total
            }
        }

    } catch (e) {
        console.error("DB Error:", e);
        throw e;
    }
};