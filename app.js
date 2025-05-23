require('dotenv').config({path: `${process.cwd()}/.env`})
const express = require('express');
const catchAsync = require("./utils/catchAsync");
const appError = require("./utils/appError")
const cors = require('cors');

const app = express();

app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'https://t3chtales.netlify.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const authRouter = require('./routes/authRoute');
const blogRouter = require('./routes/blogRoute');
const userRouter = require('./routes/userRoute');
const globalErrorHandler = require('./controller/errorController');

app.use('/api/home', catchAsync(
    async(req, res) => {
        try {
            res.json({ status: "Success", message: "Welcome to TechTales' APIs" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
));
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

app.use('*', catchAsync(
     async(req, res, next) => {
    throw new appError(`Can't find ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler)

const port = process.env.PORT || 4000;

app.listen(process.env.PORT, ()=>{
    console.log(`Server up and running on port ${port}`)
})
