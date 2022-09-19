import express, { Application, Request, Response } from 'express'
import { Low, LowSync, JSONFile, JSONFileSync } from 'lowdb'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import dbs from '../db/db.js'
import { reject } from 'lodash';
import _ from 'lodash'

const db = dbs();
const router = express.Router();

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const file = join(__dirname, 'db.json')
// const adapter = new JSONFile(file)
// const db = new Low(adapter)

// const { user } = db.data;

router.get('/', (req, res) =>
   res.send('Hello !')
);

router.get('/user/:userId', async (req, res) =>{
   await db.read();
   const users = db.data?.user.find((obj: { userId: number }) =>{
      let userId_num = Number(req.params.userId);
      if (obj.userId === userId_num){
         return obj;
      }
   });
   res.send(users);
});

router.post('/add', async (req, res) => {
   const userdata = {
      userId : req.body.userId,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      password : req.body.password
   }

await db.read();
await db.data?.user.push(userdata);
await db.write();
// db.data?.user.push(userdata).last().write()
res.send(req.body);
});

router.put('/update/:id', async (req, res) =>{
   await db.read();

   const users = db.data?.user.filter((obj: { userId: number }) =>{
      let userId_num = Number(req.params.id);
      if (obj.userId === userId_num){
         return obj;
      }
   });

   users[0].firstName = 'Edit';

   await db.write();
   res.send(users);
}
   
);
router.delete('/delete/:id', async (req, res) =>{
   await db.read();

   let userId_num = Number(req.params.id);

   // const users = db.data?.user.filter((obj: { userId: number }) =>{
      
   //    if (obj.userId === userId_num){
   //       return obj;
   //    }
   // });

   db.data?.user = _.reject(db.data?.user, function(el) {
      return el.userId === userId_num;
   });

   // users.pop();

   await db.write();
   res.send(db.data?.user);
});
export default router;