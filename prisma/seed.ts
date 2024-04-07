import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.event.create({
    data: {
      id: '2bc16a2f-8966-4e38-b50d-001bb293ea85',
      title: 'Unite WebConf',
      slug: 'unite-webconf',
      details: 'Um evento para devs apaixonados(as) por código!',
      maximumAttendees: 60,
    },
  });
}

seed().then(() => {
  console.log('Database seeded!');
  prisma.$disconnect();
});
