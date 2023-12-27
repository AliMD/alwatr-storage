import {AlwatrStorage} from '@alwatr/storage-sdk';

import type {AlwatrDocumentObject} from '@alwatr/type';

type User = AlwatrDocumentObject & {
  fname: string;
  lname: string;
  email: string;
  token?: string;
};

const token = process.env.TOKEN ?? 'YOUR_SECRET_TOKEN';

const db = new AlwatrStorage<User>({
  name: 'user-list',
  host: '127.0.0.1',
  port: 9000,
  token,
});

let ali: User | null;

try {
  ali = await db.get('alimd');

  if (ali == null) {
    console.log('ali not found');
    const ali = {
      id: 'alimd',
      fname: 'Ali',
      lname: 'Mihandoost',
      email: 'ali@mihandoost.com',
    };
    await db.set(ali);
  }
  else {
    console.log('ali found: %o', ali);
    ali.token = Math.random().toString(36).substring(2, 15);
  }
}
catch (err) {
  console.error(err);
}

await db.set({
  id: 'fmd',
  fname: 'Fatemeh',
  lname: 'Mihandoost',
  email: 'Fatemeh@mihandoost.com',
  token: Math.random().toString(36).substring(2, 15),
});

console.log("has 'alimd': %o", await db.has('alimd'));
console.log('keys: %o', await db.keys());
console.log('getAll: %o', await db.getStorage());
await db.delete('alimd');
await db.delete('fmd');

try {
  await db.delete('abcd');
}
catch (err) {
  console.log('delete 404: %o', (err as Error).message);
}
