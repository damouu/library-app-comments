import sanitizeHtml from 'sanitize-html';

export function sanitizeComment(input) {
    return sanitizeHtml(input, {
        allowedTags: [], allowedAttributes: {},
    });
}
