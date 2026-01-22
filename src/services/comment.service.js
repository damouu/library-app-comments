import * as commentRepository from '../repository/comment.repository.js';


export const saveComment = async () => {
    const newComment = await commentRepository.create({});
    return newComment;

}