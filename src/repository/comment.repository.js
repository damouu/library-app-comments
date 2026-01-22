import {Comment} from "../models/comment.schema.js";
import {v4 as uuidv4} from "uuid";

export const create = async () => {
    const userComment = new Comment({
        memberCardUuid: uuidv4(),
        chapterUuid: uuidv4(),
        avatar_URL: 'damsooo',
        content: 'これは面白くない本です',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    })

    await userComment.save();

    return true
}