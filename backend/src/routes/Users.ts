import express, { Application, Request, Response } from 'express'
import { Low, LowSync, JSONFile, JSONFileSync } from 'lowdb'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import dbs from '../db/db.js'
import _ from 'lodash'

const db = dbs();
const router = express.Router();

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const file = join(__dirname, 'db.json')
// const adapter = new JSONFile(file)
// const db = new Low(adapter)

// const { user, party } = db.data;

router.get('/', (req, res) =>
   res.send('Hello !')
);

router.get('/user', async (req, res) =>{
   await db.read();
   const users = db.data.user;
   res.send(users);
});

router.get('/user/:userId', async (req, res) =>{
   await db.read();
   const users = db.data.user.find((obj: { userId: number }) =>{
      let userId_num = Number(req.params.userId);
      if (obj.userId === userId_num){
         return obj;
      }
   });
   res.send(users);
});

router.post('/user/add', async (req, res) => {

   await db.read();
   let AUTO_INCREMENT = db.data.user[db.data.user.length-1];

   const userdata = {
      userId : AUTO_INCREMENT !== undefined ? AUTO_INCREMENT.userId+1 : 0,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      password : req.body.password
   }


await db.data.user.push(userdata);
await db.write();
// db.data.user.push(userdata).last().write()
res.send(userdata);
});

router.put('/user/update/:userId', async (req, res) =>{
   await db.read();

   const users = db.data.user.filter((obj: { userId: number }) =>{
      let userId_num = Number(req.params.userId);
      if (obj.userId === userId_num){
         return obj;
      }
   });

   users[0].firstName = req.body.firstName || users[0].firstName;
   users[0].lastName = req.body.lastName || users[0].lastName;
   users[0].email = req.body.email || users[0].email;
   users[0].password = req.body.password || users[0].password;

   await db.write();
   res.send(users);
}
   
);

router.delete('/user/delete/:userId', async (req, res) =>{
   await db.read();

   let userId_num = Number(req.params.userId);

   // const users = db.data.user.filter((obj: { userId: number }) =>{
      
   //    if (obj.userId === userId_num){
   //       return obj;
   //    }
   // });

   db.data.user = _.reject(db.data.user, function(el) {
      return el.userId === userId_num;
   });

   db.data.party = _.reject(db.data.party, function(el) {
      return el.creatorId === userId_num;
   });

   await db.write();
   res.send(db.data.user);
});

// Party

router.get('/party', async (req, res) =>{
   await db.read();
   const partys = db.data.party;
   res.send(partys);
});

router.get('/party/:partyId', async (req, res) =>{
   await db.read();
   const partys = db.data.party.find((obj: { partyId: number }) =>{
      let partyId_num = Number(req.params.partyId);
      if (obj.partyId === partyId_num){
         return obj;
      }
   });
   res.send(partys);
});

router.post('/party/add', async (req, res) => {

   await db.read();

   let AUTO_INCREMENT = db.data.party[db.data.party.length-1];

   const partydata = {
      partyId : AUTO_INCREMENT !== undefined ? AUTO_INCREMENT.partyId+1 : 0,
      creatorId: req.body.creatorId,
      description : req.body.description || 'ไม่มีรายละเอียดปาร์ตี้',
      registered : 0,
      maxguests : req.body.maxguests || 0,
      image : req.body.image || ''
   }

await db.data.party.push(partydata);
await db.write();
// db.data.user.push(userdata).last().write()
res.send(partydata);
});

router.put('/party/update/:partyId', async (req, res) =>{
   await db.read();

   const partys = db.data.party.filter((obj: { partyId: number }) =>{
      let partyId_num = Number(req.params.partyId);
      if (obj.partyId === partyId_num){
         return obj;
      }
   });

   partys[0].description = req.body.description ||  partys[0].description;
   partys[0].registered = req.body.registered || partys[0].registered;
   partys[0].maxguests = req.body.maxguests || partys[0].maxguests;
   partys[0].image = req.body.image || partys[0].image;

   // partys[0] = {
   //    description : req.body.description,
   //    registered : req.body.description,
   //    maxguests : req.body.maxguests,
   //    image : req.body.image
   // }

   await db.write();
   res.send(partys);
}
   
);

router.delete('/party/delete/:partyId', async (req, res) =>{
   await db.read();

   let partyId_num = Number(req.params.partyId);

   db.data.party = _.reject(db.data.party, function(el) {
      return el.partyId === partyId_num;
   });

   await db.write();
   res.send(db.data.party);
});

export default router;