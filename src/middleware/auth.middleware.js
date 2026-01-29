import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const publicKeyPath = path.resolve(process.env.PUBLIC_KEY_PATH);

const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Missing token'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, publicKey, {
            algorithms: ['RS256'], issuer: 'library-app-auth', audience: 'library-app-borrow',
        });

        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}
