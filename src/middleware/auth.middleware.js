import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKey = fs.readFileSync(
    path.join(__dirname, '../keys/public_key.pem'),
    'utf8'
);

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'library-app-auth',
            audience: 'library-app-borrow',
        });

        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
