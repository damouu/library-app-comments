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