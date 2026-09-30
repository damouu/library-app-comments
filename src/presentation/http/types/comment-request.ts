export interface CreateCommentBody {
    comment: string;
}

export interface UpdateCommentBody {
    comment: string;
}

export interface CommentPaginationQuery {
    page?: number;
    size?: number;
}