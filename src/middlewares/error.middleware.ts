import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { HttpException } from '@/exceptions/http.exception';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    //Print the error stack
    logger.log('error', error.stack);

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
