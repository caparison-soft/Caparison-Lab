const { PrismaClient } = require('./app/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    console.log('Success');
  } catch (e) {
    console.error('Error querying:', e);
  }
}
main();
