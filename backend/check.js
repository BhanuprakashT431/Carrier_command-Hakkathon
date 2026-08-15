const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.careerDecision.findFirst({ orderBy: { createdAt: 'desc' } })
  .then(cd => console.log(JSON.stringify(cd, null, 2)))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
