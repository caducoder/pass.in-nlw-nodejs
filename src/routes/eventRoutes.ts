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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Another event with same title already exists.' });
  }

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    },
  });

  return res.status(StatusCodes.CREATED).json({ eventId: event.id });
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

  const attendeeFromEmail = await prisma.attendee.findUnique({
    where: {
      eventId_email: {
        email,
        eventId,
      },
    },
  });

  if (attendeeFromEmail !== null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'This e-mail is already registered for this event' });
  }

  const [event, eventsAttendeeNumber] = await Promise.all([
    prisma.event.findUnique({
      where: {
        id: eventId,
      },
    }),
    prisma.attendee.count({
      where: {
        eventId,
      },
    }),
  ]);

  if (
    event?.maximumAttendees &&
    eventsAttendeeNumber >= event.maximumAttendees
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'This event has reached the maximum amount of attendees.',
    });
  }

  const attendee = await prisma.attendee.create({
    data: {
      name,
      email,
      eventId,
    },
  });

  return res.status(StatusCodes.CREATED).json({ attendeeId: attendee.id });
});

eventRouter.get('/:eventId', async function (req, res) {
  const eventSchema = z.object({
    params: z.object({
      eventId: z.string().uuid(),
    }),
  });

  const {
    params: { eventId },
  } = await zParse(eventSchema, req, res);

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      details: true,
      _count: {
        select: { Attendee: true },
      },
    },
  });

  if (event == null) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Event not found' });
  }

  return res.status(StatusCodes.OK).json({ event });
});

export default eventRouter;
