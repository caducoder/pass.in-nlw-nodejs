import express from 'express';
import attendeeRouter from './routes/attendeeRoutes.js';
import eventRouter from './routes/eventRoutes.js';

import 'dotenv/config';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/events', eventRouter);
app.use('/api/attendees', attendeeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
