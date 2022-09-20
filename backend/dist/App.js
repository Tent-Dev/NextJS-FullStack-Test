import express from 'express';
import bodyParser from "body-parser";
import userRouter from './routes/Users.js';
import cors from 'cors';
const allowedOrigins = ['http://localhost:3000'];
const options = {
    origin: allowedOrigins
};
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(cors(options));
app.use(bodyParser.json());
app.use('/api', userRouter);
app.listen(3100);
