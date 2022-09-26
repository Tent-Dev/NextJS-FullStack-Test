import express, { Application, Request, Response } from 'express'
import dbs from '../db/db.js'
import _ from 'lodash'
import bcrypt from 'bcrypt'
import jwt from "jwt-simple"
import {ExtractJwt,Strategy} from 'passport-jwt'
import passport from "passport"

const db: any = dbs();
const router = express.Router();
const saltRounds = 10;
const SECRET = "MY_SECRET_KEY";

////////////////////JWT Middleware Zone////////////////////
const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader("authorization"),
   secretOrKey: SECRET
};

const jwtAuth = new Strategy(jwtOptions, async (payload, done) => {

   await db.read();
   const userData = await db.data.user.find((obj: { email: string }) =>{
      if (obj.email === payload.email){
         return obj;
      }
   });

   if(userData){
      done(null, true);
   }
   else{
      done(null, false);
   }
});

passport.use(jwtAuth);

const requireJWTAuth = passport.authenticate("jwt",{session:false, failureRedirect: 'http://localhost:3100/api/nonpermission'});

////////////////////End of JWT Middleware Zone/////////////////////////////
router.get('/', (req, res) =>
   res.send('Hello !')
);

router.get('/user', requireJWTAuth, async (req, res) =>{
   await db.read();
   const users = db.data.user;
   res.send(users);
});

router.get('/nonpermission', (req, res) =>{
res.status(400).send({
   message: 'No permission',
   code: 1000,
   redirectTo: 'http://localhost:3000'
});
});

router.post('/user/login', async (req, res) =>{
   await db.read();

   let userData: any = {};

   await db.data.user.find((obj: {status: string, password: string, email: string }) =>{
      if (obj.email.toLowerCase() === req.body.email.toLowerCase() && obj.status === 'Active'){
         userData = obj;
      }
   });

   if(!_.isEmpty(userData)){
      bcrypt.compare(req.body.password, userData.password, function(err, result) {
         if(result){
            const payload = {
               userId : userData.userId,
               email: userData.email,
               created_timestamp: new Date().getTime()
            };

            let outputData = {
               userId: userData.userId,
               email: userData.email,
               firstName: userData.firstName,
               lastName: userData.lastName,
               party_joined: userData.party_joined
            }
            res.send({user: outputData, Token : jwt.encode(payload, SECRET)});
         }else{
            res.status(400).json({
               code: 1002,
               message: 'Password is not correct'
            });
            return;
         }
     });
   }else{
      res.status(400).json({
         code: 1003,
         message: 'User not found'
      });
      return;
   }
});

router.get('/user/:userId', requireJWTAuth, async (req, res) =>{
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
   let hadRegister = false;
   await db.data.user.find((obj: {password: string, email: string }) =>{
      if (obj.email.toLowerCase() === req.body.email.toLowerCase()){
         hadRegister = true;
      }
   });

   if(hadRegister){
      res.status(400).json({
         code: 1004,
         message: 'This account already has a user.'
      });
      return;
   }else{
      bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
         userdata = {
            userId : AUTO_INCREMENT !== undefined ? AUTO_INCREMENT.userId+1 : 0,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : hash,
            party_joined: [],
            status: 'Active'
         }
   
         await db.data.user.push(userdata);
         await db.write();
         res.status(201).json({
            code: 201,
            message: 'Create Account successfully.'
         });
      });
   }

   
});

router.put('/user/update/:userId', requireJWTAuth, async (req, res) =>{
   await db.read();
   let JWT_CHECK = jwt.decode(req.headers.authorization, SECRET);
   let userId_num = Number(req.params.userId);
   const users = db.data.user.filter((obj: { userId: number }) =>{
      if (obj.userId === userId_num){
         return obj;
      }
   });

   if(JWT_CHECK.userId === users[0].userId){
      users[0].firstName = req.body.firstName || users[0].firstName;
      users[0].lastName = req.body.lastName || users[0].lastName;
      users[0].email = req.body.email || users[0].email;
      users[0].password = req.body.password || users[0].password;
      
      if(_.has(req.body, 'party_joined')){

         if(_.isArray(users[0].party_joined)){
            users[0].party_joined.push(req.body.party_joined);
         }else{
            users[0].party_joined = []
            users[0].party_joined.push(req.body.party_joined);
         }

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

         partys[0].registered = partys[0].guest.length

      }
      else if(_.has(req.body, 'party_leave')){
         users[0].party_joined = _.pull(users[0].party_joined, req.body.party_leave);

         const partys = db.data.party.filter((obj: { partyId: number }) =>{
            if (obj.partyId === req.body.party_leave){
               return obj;
            }
         });

         partys[0].guest = _.pull(partys[0].guest, userId_num);
         partys[0].registered = partys[0].guest.length;

      }

      await db.write();
      res.status(200).json({
         code: 200,
         message: 'Updated successfully.'
      });
   }else{
      res.status(400).json({
         code: 2001,
         message: 'You don\'t have permission to edit.'
      });
   }
}
   
);

router.delete('/user/delete/:userId', requireJWTAuth, async (req, res) =>{
   await db.read();

   let userId_num = Number(req.params.userId);
   const users = db.data.user.filter((obj: { status: string, userId: number }) =>{
      if (obj.userId === userId_num){
         obj.status = 'Deactive';
         return obj;
      }
   });

   const partys = db.data.party.filter((obj: {status: string, creatorId: number }) =>{
      if (obj.creatorId === userId_num){
         obj.status = "Deactive";
         return obj;
      }
   });

   await db.write();

   res.status(200).json({
      code: 200,
      message: 'Deleted successfully'
   });
});

router.put('/user/force', requireJWTAuth, async (req, res) =>{
   await db.read();

   db.data.user.filter((obj: { status: string }) =>{
      if (!_.has(obj, 'status')){
         obj.status = 'Active';
         return obj;
      }
   });

   await db.write();
   res.status(200).json({
      code: 200,
      message: 'Updated successfully.'
   });
});

// Party

router.post('/party', requireJWTAuth, async (req, res) =>{
   await db.read();

   let partys = db.data.party.filter((obj: { status: string}) =>{
      if (obj.status == 'Active'){
         return obj;
      }
   });

   if('creatorId' in req.body){

      if(req.body.mode === 'own'){
         partys = db.data.party.filter((obj: { status: string, creatorId: number}) =>{
            if (obj.creatorId === req.body.creatorId && obj.status == 'Active'){
               return obj;
            }
         });
      }else{
         //mode joined
         const users = db.data.user.find((obj: { userId: number }) =>{
            if (obj.userId === req.body.creatorId){
               return obj;
            }
         });

         partys = db.data.party.filter((obj: { partyId: number, status: string }) =>{
            if (_.includes(users.party_joined,obj.partyId ) && obj.status == 'Active'){
               return obj;
            }
         });
      }
   }

   res.send(partys);
});

router.get('/party/:partyId', requireJWTAuth, async (req, res) =>{
   
   await db.read();
   const partys = db.data.party.filter((obj: { partyId: number }) =>{
      let partyId_num = Number(req.params.partyId);
      if (obj.partyId === partyId_num){
         return obj;
      }
   });

   res.status(200).json({
      code: 200,
      message: 'Get data successfully.'
   });
});

router.post('/party/add', requireJWTAuth, async (req, res) => {

   await db.read();

   let AUTO_INCREMENT = db.data.party[db.data.party.length-1];

   const partydata = {
      partyId : AUTO_INCREMENT !== undefined ? AUTO_INCREMENT.partyId+1 : 0,
      creatorId: req.body.creatorId,
      description : req.body.description || 'ไม่มีรายละเอียดปาร์ตี้',
      registered : 0,
      maxguests : req.body.maxguests || 0,
      image : req.body.image || '',
      guest: [],
      status: 'Active'
   }

await db.data.party.push(partydata);
await db.write();

res.send(partydata);
});

router.put('/party/update/:partyId', requireJWTAuth, async (req, res) =>{
   await db.read();

   let JWT_CHECK = jwt.decode(req.headers.authorization, SECRET);

   const partys = db.data.party.filter((obj: { partyId: number }) =>{
      let partyId_num = Number(req.params.partyId);
      if (obj.partyId === partyId_num){
         return obj;
      }
   });

   if(JWT_CHECK.userId === partys[0].creatorId){
      partys[0].description = req.body.description ||  partys[0].description;
      partys[0].registered = req.body.registered || partys[0].registered;
      partys[0].maxguests = req.body.maxguests || partys[0].maxguests;
      partys[0].image = req.body.image || partys[0].image;

      await db.write();
      res.status(201).json({
         code: 201,
         message: 'Create party successfully.'
      });
   }else{
      res.status(400).json({
         code: 2001,
         message: 'You don\'t have permission to edit.'
      });
   }
}
   
);

router.delete('/party/delete/:partyId', requireJWTAuth, async (req, res) =>{
   await db.read();

   let JWT_CHECK = jwt.decode(req.headers.authorization, SECRET);

   let partyId_num = Number(req.params.partyId);
   const partys = db.data.party.filter((obj: { partyId: number }) =>{
      if (obj.partyId === partyId_num){
         return obj;
      }
   });

   if(JWT_CHECK.userId === partys[0].creatorId){
      partys[0].status = 'Deactive';
      
      await db.write();
      res.send('Deleted');
   }else{
      res.status(400).json({
         code: 2001,
         message: 'You don\'t have permission to edit.'
      });
   }
});

export default router;