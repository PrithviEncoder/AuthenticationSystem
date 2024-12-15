import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
}));

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));

// Import Routes
import userRouter from './routes/user.route.js';
app.use('/user', userRouter);



export default app;
