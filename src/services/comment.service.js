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


export const getUserComment = async (page, size, memberCardUUID) => {

    const validatedPage = Math.max(1, page);
    const validatedSize = Math.min(50, Math.max(1, size));

    const result = await commentRepository.findByUser(
        validatedPage,
        validatedSize,
        memberCardUUID,
    );

    if (!result || result.totalCount === 0) {
        return {
            comments: [],
            pagination: {
                currentPage: validatedPage,
                totalPages: 0,
                count: 0,
                total: 0
            }
        };
    }

    return result;
}


export const getComments = async (page, size, chapterUuid) => {

    const validatedPage = Math.max(1, page);
    const validatedSize = Math.min(50, Math.max(1, size));

    const result = await commentRepository.findByChapter(
        validatedPage,
        validatedSize,
        chapterUuid,
    );

    if (!result || result.totalCount === 0) {
        return {
            comments: [],
            pagination: {
                currentPage: validatedPage,
                totalPages: 0,
                count: 0,
                total: 0
            }
        };
    }

    return result;
}