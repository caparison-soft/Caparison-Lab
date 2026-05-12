const prisma = require('./lib/prisma.js');

async function main() {
  const email = 'admin@gmail.com';
  
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { subscriptionTier: 'PRO' },
    });
    console.log(`Successfully updated ${user.email} to ${user.subscriptionTier}`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    process.exit(0);
  }
}

main();
