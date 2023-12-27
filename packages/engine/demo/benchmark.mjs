import {random} from '@alwatr/math';
import {AlwatrStorageEngine} from '../dist/main';

const db = new AlwatrStorageEngine({
  name: 'junk-data',
  path: 'db',
  saveBeautiful: false,
  devMode: false,
});

console.time('set all items');

const max = 100_000;
for (let i = 0; i < max; i++) {
  db.set({
    id: 'user_' + i,
    fname: random.string(4, 16),
    lname: random.string(4, 32),
    email: random.string(8, 32),
    token: random.string(16),
  });
}

console.timeEnd('set all items');

console.time('get item');
const item = db.get('user_' + max / 2);
console.timeEnd('get item');
console.dir(item);
