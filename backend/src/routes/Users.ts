import express, { Application, Request, Response } from 'express'

const router = express.Router();

router.get('/', (req, res) =>
   res.send('Hello lowdb!')
);
router.get('/user/:userId', (req, res) =>
   res.send('Get user data ' + req.params.userId)
);
router.post('/add', (req, res) =>
   res.send('post ok')
);
router.put('/update/:id', (req, res) =>
   res.send('put ok')
);
router.delete('/delete/:id', (req, res) =>
   res.send('delete ok')
);
module.exports = router;