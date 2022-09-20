import express, { Application, Request, Response } from 'express'
import { Low, LowSync, JSONFile, JSONFileSync } from 'lowdb'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import dbs from '../db/db.js'
import _ from 'lodash'
import bcrypt from 'bcrypt'

const db = dbs();
const router = express.Router();

const saltRounds = 10;

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

router.post('/user/login', async (req, res) =>{
   await db.read();

   let userData = {};

   await db.data.user.find((obj: {password: string, email: string }) =>{
      if (obj.email.toLowerCase() === req.body.email.toLowerCase()){
         userData = obj;
      }
   });

   if(!_.isEmpty(userData)){
      bcrypt.compare(req.body.password, userData.password, function(err, result) {
         if(result){
            res.send(userData);
            return;
         }else{
            res.status(400).json({
               message: 'Password is not correct'
            });
            return;
         }
     });
   }else{
      res.status(400).json({
         message: 'User not found'
      });
      return;
   }
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
   let userdata = {};

   bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      userdata = {
         userId : AUTO_INCREMENT !== undefined ? AUTO_INCREMENT.userId+1 : 0,
         firstName : req.body.firstName,
         lastName : req.body.lastName,
         email : req.body.email,
         password : hash,
         party_joined: []
      }

      await db.data.user.push(userdata);
      await db.write();
      res.send(userdata);
   });
// db.data.user.push(userdata).last().write()
});

router.put('/user/update/:userId', async (req, res) =>{
   await db.read();
   let userId_num = Number(req.params.userId);
   const users = db.data.user.filter((obj: { userId: number }) =>{
      if (obj.userId === userId_num){
         return obj;
      }
   });

   if(_.isArray(users[0].party_joined)){
      users[0].party_joined.push(req.body.party_joined);
   }else{
      users[0].party_joined = []
      users[0].party_joined.push(req.body.party_joined);
   }

   // return res.send(users[0].party_joined);

   users[0].firstName = req.body.firstName || users[0].firstName;
   users[0].lastName = req.body.lastName || users[0].lastName;
   users[0].email = req.body.email || users[0].email;
   users[0].password = req.body.password || users[0].password;
   // users[0].party_joined = users[0].party_joined.push(req.body.party_joined) || users[0].party_joined || [];
   
   if(_.has(req.body, 'party_joined')){
      const partys = db.data.party.filter((obj: { partyId: number }) =>{
         if (obj.partyId === req.body.party_joined){
            return obj;
         }
      });

      if(_.isArray(partys[0].guest)){
         partys[0].guest.push(userId_num);
      }else{
         partys[0].guest = []
         partys[0].guest.push(userId_num);
      }

      // partys[0].guest = partys[0].guest.push(req.params.userId) || partys[0].guest.push || [];
   }

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

router.post('/party', async (req, res) =>{
   await db.read();
   
   let partys = db.data.party;

   if('creatorId' in req.body){

      if(req.body.mode === 'own'){
         partys = db.data.party.filter((obj: { creatorId: number }) =>{
            if (obj.creatorId === req.body.creatorId){
               return obj;
            }
         });
      }else{

         const users = db.data.user.find((obj: { userId: number }) =>{
            if (obj.userId === req.body.creatorId){
               return obj;
            }
         });

         // return res.send(users.party_joined);

         partys = db.data.party.filter((obj: { partyId: number }) =>{
            if (_.includes(users.party_joined,obj.partyId)){
               return obj;
            }
         });
      }
   }

   res.send(partys);
});

router.get('/party/:partyId', async (req, res) =>{
   await db.read();
   const partys = db.data.party.filter((obj: { partyId: number }) =>{
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
      image : req.body.image || '',
      guest: []
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
   res.send('Deleted');
});

export default router;