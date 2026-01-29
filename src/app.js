import express from 'express';
import commentRouter from './routes/comment.routes.js';
import {trackRequests} from './utils/metrics.js';

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const app = express();

app.use(express.json());
app.use(trackRequests);
app.use(cors(corsOptions));
app.use('/api', commentRouter);

export default app;
