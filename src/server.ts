import { PrismaClient } from "@prisma/client";
import express from "express";
import { z } from "zod";

import "dotenv/config";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const prisma = new PrismaClient({
  log: ["query"],
});

app.post("/events", async function (req, res) {
  // schema de valição
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  // validando o body da request
  const data = createEventSchema.parse(req.body);

  const event = await prisma.event.create({
    data: {
      ...data,
      slug: new Date().toISOString(),
    },
  });

  res.status(201).json({ eventId: event.id });
});

app.listen(3000, () => {
  console.log("Server running");
});
