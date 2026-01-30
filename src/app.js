import express from 'express';
import commentRouter from './routes/comment.routes.js';
import {trackRequests} from './utils/metrics.js';
import cors from 'cors';
import {corsOptions} from './config/corsOptions.js';

const app = express();

app.use(express.json());
app.use(trackRequests);
app.use(cors(corsOptions));
app.use('/api/comment', commentRouter);

export default app;
