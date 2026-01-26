import {Comment} from "../models/comment.schema.js";

export const create = async (comment, chapterUUID, memberCardUuid, userName, userEmail, avatar_URL) => {
    const userComment = new Comment({
        memberCardUuid: memberCardUuid,
        chapterUuid: chapterUUID,
        userName: userName,
        userEmail: userEmail,
        avatar_URL: avatar_URL,
        content: comment,
    })

    await userComment.save();

    return true
}