import express from 'express';
import dbs from '../db/db.js';
import _ from 'lodash';
const db = dbs();
const router = express.Router();
// const __dirname = dirname(fileURLToPath(import.meta.url));
// const file = join(__dirname, 'db.json')
// const adapter = new JSONFile(file)
// const db = new Low(adapter)
// const { user } = db.data;
router.get('/', (req, res) => res.send('Hello !'));
router.get('/user/:userId', async (req, res) => {
    var _a;
    await db.read();
    const users = (_a = db.data) === null || _a === void 0 ? void 0 : _a.user.find((obj) => {
        let userId_num = Number(req.params.userId);
        if (obj.userId === userId_num) {
            return obj;
        }
    });
    res.send(users);
});
router.post('/add', async (req, res) => {
    var _a;
    const userdata = {
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    await db.read();
    await ((_a = db.data) === null || _a === void 0 ? void 0 : _a.user.push(userdata));
    await db.write();
    // db.data?.user.push(userdata).last().write()
    res.send(req.body);
});
router.put('/update/:id', async (req, res) => {
    var _a;
    await db.read();
    const users = (_a = db.data) === null || _a === void 0 ? void 0 : _a.user.filter((obj) => {
        let userId_num = Number(req.params.id);
        if (obj.userId === userId_num) {
            return obj;
        }
    });
    users[0].firstName = 'Edit';
    await db.write();
    res.send(users);
});
router.delete('/delete/:id', async (req, res) => {
    var _a, _b, _c;
    await db.read();
    let userId_num = Number(req.params.id);
    // const users = db.data?.user.filter((obj: { userId: number }) =>{
    //    if (obj.userId === userId_num){
    //       return obj;
    //    }
    // });
    (_a = db.data) === null || _a === void 0 ? void 0 : _a.user = _.reject((_b = db.data) === null || _b === void 0 ? void 0 : _b.user, function (el) {
        return el.userId === userId_num;
    });
    // users.pop();
    await db.write();
    res.send((_c = db.data) === null || _c === void 0 ? void 0 : _c.user);
});
export default router;
