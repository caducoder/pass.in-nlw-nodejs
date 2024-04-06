import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyZodObject, ZodError, z } from 'zod';

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request,
  res: Response
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.errors });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro interno do servidor' });
  }
}
