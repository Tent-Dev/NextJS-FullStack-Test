import express from 'express';
import bodyParser from "body-parser";
import userRouter from './routes/Users.js';
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(bodyParser.json());
app.use('/api', userRouter);
app.listen(3100);
