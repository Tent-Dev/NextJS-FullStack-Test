"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => res.send('Hello lowdb!'));
router.get('/user/:userId', (req, res) => res.send('Get user data ' + req.params.userId));
router.post('/add', (req, res) => res.send('post ok'));
router.put('/update/:id', (req, res) => res.send('put ok'));
router.delete('/delete/:id', (req, res) => res.send('delete ok'));
module.exports = router;
