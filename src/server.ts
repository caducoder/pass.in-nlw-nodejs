import express from "express";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";

import "dotenv/config";
import attendeeRouter from "./routes/attendeeRoutes.js";
import eventRouter from "./routes/eventRoutes.js";

const app = express();
const PORT = 3000;

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/events", eventRouter);
app.use("/api/attendees", attendeeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
