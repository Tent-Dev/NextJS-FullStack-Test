"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var bodyParser = require('body-parser');
const app = (0, express_1.default)();
const userRouter = require("./routes/Users");
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(bodyParser.json());
app.use('/api', userRouter);
app.listen(3100);
