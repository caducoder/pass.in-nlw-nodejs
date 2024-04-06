import express from 'express';

import 'dotenv/config';
import eventRouter from './routes/eventRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/events', eventRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
