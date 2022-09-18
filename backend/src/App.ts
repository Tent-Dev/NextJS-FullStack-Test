import express, { Application, Request, Response } from 'express'
var bodyParser = require('body-parser')
const app = express();
const userRouter = require("./routes/Users");

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(bodyParser.json());
app.use('/api', userRouter)

app.listen(3100)