import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'


const app = express();
const _dirname = path.resolve();//directory name

app.use(cors({
    origin:`${process.env.CORS_ORIGIN}`,
    credentials:true
}))

app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
// app.use(express.static("public"));
app.use(express.json({ limit: '16kb' })) //to accept req from body etc

import userRouter from './routes/user.route.js'
app.use('/user', userRouter);

//create a react static app using express.static and run when backend will run
if (process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(_dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.js"));
    });

}

export default app

