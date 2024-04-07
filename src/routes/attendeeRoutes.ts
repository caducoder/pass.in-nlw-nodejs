import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { zParse } from '../utils/zod-parse-request.js';

const attendeeRouter = express.Router();

attendeeRouter.get('/:attendeeId/badge', async function (req, res) {
  const requestSchema = z.object({
    params: z.object({
      attendeeId: z.coerce.number(),
    }),
  });

  const {
    params: { attendeeId },
  } = await zParse(requestSchema, req, res);

  const attendee = await prisma.attendee.findUnique({
    where: {
      id: attendeeId,
    },
    select: {
      name: true,
      email: true,
      event: {
        select: { title: true },
      },
    },
  });

  if (attendee == null) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Attendee not found' });
  }

  const baseURL = `${req.protocol}://${req.header('Host')}`;

  const checkInUrl = new URL(
    `/api/attendees/${attendeeId}/check-in`,
    baseURL
  );

  return res.status(StatusCodes.OK).json({
    badge: {
      name: attendee.name,
      email: attendee.email,
      eventTitle: attendee.event.title,
      checkInUrl: checkInUrl.toString(),
    },
  });
});

attendeeRouter.get('/:attendeeId/check-in', async function (req, res) {
  const schema = z.object({
    params: z.object({
      attendeeId: z.coerce.number(),
    }),
  });

  const {
    params: { attendeeId },
  } = await zParse(schema, req, res);

  const attendeeCheckIn = await prisma.checkIn.findUnique({
    where: {
      attendeeId,
    },
  });

  if (attendeeCheckIn !== null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Attendee already checked in!' });
  }

  await prisma.checkIn.create({
    data: {
      attendeeId,
    },
  });

  return res.status(StatusCodes.CREATED).send();
});
export default attendeeRouter;
