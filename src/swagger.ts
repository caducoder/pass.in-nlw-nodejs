import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '0.1.0',
    title: 'Pass.in REST API',
    description:
      'This is a simple CRUD API application made with Express and documented with Swagger',
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Caducoder',
      url: 'https://caducoder.vercel.app/',
      email: 'carlosamericodev@gmail.com',
    },
  },
  host: 'localhost:3000',
  basePath: '/api',
};

const outputFile = './swagger-output.json';

const routes = ['./routes/attendeeRoutes.ts', './routes/eventRoutes.ts'];

swaggerAutogen()(outputFile, routes, doc);
