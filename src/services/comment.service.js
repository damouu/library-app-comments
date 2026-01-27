import * as commentRepository from '../repository/comment.repository.js';


export const saveComment = async ({comment, chapterUUID, memberCardUuid, userName, userEmail, avatar_URL}) => {
    return await commentRepository.create(comment, chapterUUID, memberCardUuid, userName, userEmail, avatar_URL);
}

export const updateComment = async ({comment, commentUuid, user_memberCardUUID}) => {

    const existingComment = await commentRepository.findByUuid(commentUuid);

    if (existingComment.memberCardUuid !== user_memberCardUUID) {
        throw new Error("Unauthorized");
    }

    return await commentRepository.update(comment, commentUuid);
}

export const deleteComment = async ({commentUuid, user_memberCardUUID}) => {

    const existingComment = await commentRepository.findByUuid(commentUuid);

    if (existingComment.memberCardUuid !== user_memberCardUUID) {
        throw new Error("Unauthorized");
    }

    return await commentRepository.deleteComment(commentUuid);
}