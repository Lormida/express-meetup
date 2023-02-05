import { Request, Response, NextFunction } from "express"
import HttpError from "../utils/HttpError"
import logger from "../utils/logger"

export const errorMiddleware = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.info('Error handle by bus : ', error.message, error.statusCode, error.stack)

  res.status(error.statusCode).json({
    message: error.message,
  })
}
