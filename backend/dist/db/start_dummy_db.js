// import { Low, JSONFile } from 'lowdb'
// const low = require('lowdb')
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
// import db from './db.js'
// async () => {
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
db.data || (db.data = { user: [], party: [] });
// db.data?.user.push({
//     userId : 1,
//     firstName : '',
//     lastName : '',
//     email : '',
//     password : ''
// })
await db.write();
// }
