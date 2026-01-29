export const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, credentials: true, optionsSuccessStatus: 200
};
