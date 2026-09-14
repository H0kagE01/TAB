import { Brands } from './collections/Brands';
import { Categories } from './collections/Categories';
import { Collections } from './collections/Collections';
import { Countries } from './collections/Countries';
import { Inquiries } from './collections/Inquiries';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Stores } from './collections/Stores';
import { Users } from './collections/Users';

export const payloadConfigDefinition = {
  admin: {
    user: 'users',
  },
  collections: [
    Products,
    Categories,
    Brands,
    Countries,
    Collections,
    Stores,
    Inquiries,
    Media,
    Users,
  ],
  secret: process.env.PAYLOAD_SECRET || 'konfetnica-secure-payload-secret-dev',
  databaseUri: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/konfetnica',
};
