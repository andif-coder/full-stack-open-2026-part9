import { type Request, type Response, type NextFunction } from 'express';
import { NewEntrySchema } from './types.ts';
import { z } from 'zod';

export const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
		const errorMessage = error.issues.map(i => i.message).join(', ');
		res.status(400).send(`Error: ${errorMessage}`);
  } else {
    next(error);
  }
};
