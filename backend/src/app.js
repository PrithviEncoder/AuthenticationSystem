import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

const app = express();

app.use(cors({
    origin:`${process.env.CORS_ORIGIN}`,
    credentials:true
}))

app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
// app.use(express.static("public"));
app.use(express.json({limit:'16kb'})) //to accept req from body etc

import userRouter from './routes/user.route.js'
app.use('/user',userRouter)

export default app

