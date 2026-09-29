import sanitizeHtml from "sanitize-html";

export function sanitizeComment(input: string): string {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
    });
}