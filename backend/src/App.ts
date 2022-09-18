import express, { Application, Request, Response } from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3100)