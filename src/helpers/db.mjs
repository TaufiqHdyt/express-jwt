import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.ts';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize Prisma Client.');
}

const adapter = new PrismaMariaDb(databaseUrl);
const db = new PrismaClient({ adapter });

export default db;
