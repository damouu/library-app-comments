export interface CommentPage<T> {
    data: T[];
    meta: {
        page: number;
        size: number;
        count: number;
        total: number;
        total_pages: number;
    };
}