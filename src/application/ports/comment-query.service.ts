import type {CommentPage} from "../types/comment-page.js";
import {ChapterComment} from "../types/chapter-comment.js";
import {UserComment} from "../types/user-comment.js";


export interface CommentQueryService {
    findByUser(page: number, size: number, memberCardUuid: string): Promise<CommentPage<UserComment>>;

    findByChapter(page: number, size: number, chapterUuid: string): Promise<CommentPage<ChapterComment>>;
}