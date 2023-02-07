import { Request, Response, NextFunction } from 'express'
import HttpError from '../utils/HttpError'
import logger from '../utils/logger'

export const errorMiddleware = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message, 'Incorrect error.message in caught error')

  res.status(error.statusCode || 500).json({
    message: error.message,
  })
}
