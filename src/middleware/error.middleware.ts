import { Request, Response, NextFunction } from "express"
import HttpError from "../utils/HttpError"
import logger from "../utils/logger"

export const errorMiddleware = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(error, 'Error handle by bus')

  res.status(error.statusCode).json({
    message: error.message,
  })
}
