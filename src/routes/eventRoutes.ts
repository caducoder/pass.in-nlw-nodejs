import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { generateSlug } from '../utils/generate-slug.js';
import { zParse } from '../utils/zod-parse-request.js';

const eventRouter = express.Router();

eventRouter.post('/', async function (req, res) {
  // schema de valição
  const createEventSchema = z.object({
    body: z.object({
      title: z.string().min(4),
      details: z.string().nullable(),
      maximumAttendees: z.number().int().positive().nullable(),
    }),
  });

  // validando o body da request
  const {
    body: { title, details, maximumAttendees },
  } = await zParse(createEventSchema, req, res);

  const slug = generateSlug(title);

  const eventWithSameSlug = await prisma.event.findUnique({
    where: {
      slug,
    },
  });

  if (eventWithSameSlug !== null) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Another event with same title already exists.' });
    return;
  }

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    },
  });

  res.status(StatusCodes.CREATED).json({ eventId: event.id });
});

eventRouter.post('/:eventId/attendees', async function (req, res) {
  const registerAttendeeEventSchema = z.object({
    body: z.object({
      name: z.string().min(4),
      email: z.string().email(),
    }),
    params: z.object({
      eventId: z.string().uuid(),
    }),
  });

  const {
    body: { name, email },
    params: { eventId },
  } = await zParse(registerAttendeeEventSchema, req, res);

  const attendee = await prisma.attendee.create({
    data: {
      name,
      email,
      eventId,
    },
  });

  return res.status(StatusCodes.CREATED).json({ attendeeId: attendee.id });
});

export default eventRouter;
