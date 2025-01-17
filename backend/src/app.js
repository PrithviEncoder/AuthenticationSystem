import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const __dirname = path.resolve(); // Correct directory name


// CORS Configuration
const allowedOrigin=[`${process.env.CORS_ORIGIN}`,"https://prithviencoder.github.io"]
app.use(cors({//but in deployment or production cors_origin = new url which is from render .
    origin: (origin, callback) => {
        if (allowedOrigin.includes(origin) || !origin) {
            callback(null, true)
        }  
        else {
            callback(new Error("This request is blocked by cors"))
        }

    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));


// Serve React Frontend in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


// Import Routes
import userRouter from './routes/user.route.js';
app.use('/user', userRouter);



export default app;
