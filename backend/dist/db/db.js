import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);

export default function () {
    return new Low(adapter);
}
;
