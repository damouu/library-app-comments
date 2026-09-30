export interface CommentProps {
    commentUuid: string;
    memberCardUuid: string;
    chapterUuid: string;
    userName: string;
    userEmail: string;
    avatarUrl: string | null;
    content: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Comment {
    private constructor(private readonly props: CommentProps) {
        if (!props.content || props.content.trim().length === 0) {
            throw new Error("comment's content can not be empty.");
        }
    }

    public static create(payload: {
        commentUuid: string;
        memberCardUuid: string;
        chapterUuid: string;
        userName: string;
        userEmail: string;
        avatarUrl: string | null;
        content: string;
    }): Comment {
        const now = new Date();

        return new Comment({
            ...payload,
            deletedAt: null,
            createdAt: now,
            updatedAt: now,
        });
    }

    public static reconstitute(props: CommentProps): Comment {
        return new Comment(props);
    }

    get commentUuid(): string {
        return this.props.commentUuid;
    }

    get memberCardUuid(): string {
        return this.props.memberCardUuid;
    }

    get chapterUuid(): string {
        return this.props.chapterUuid;
    }

    get userName(): string {
        return this.props.userName;
    }

    get userEmail(): string {
        return this.props.userEmail;
    }

    get avatarUrl(): string | null {
        return this.props.avatarUrl;
    }

    get content(): string {
        return this.props.content;
    }

    get deletedAt(): Date | null {
        return this.props.deletedAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public updateContent(newContent: string): void {
        if (!newContent || newContent.trim().length === 0) {
            throw new Error("comment's content can not be empty.");
        }
        this.props.content = newContent;
        this.props.updatedAt = new Date();
    }

    public markAsDeleted(): void {
        this.props.deletedAt = new Date();
        this.props.updatedAt = new Date();
    }
}