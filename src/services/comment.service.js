import * as commentRepository from '../repository/comment.repository.js';


export const saveComment = async ({comment, chapterUUID, memberCardUuid, userName, userEmail, avatar_URL}) => {
    return await commentRepository.create(comment, chapterUUID, memberCardUuid, userName, userEmail, avatar_URL);
}