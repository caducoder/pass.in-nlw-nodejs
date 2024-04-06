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
  return res.status(StatusCodes.OK).json({ attendee });
});

export default attendeeRouter;
