import { Response, Request, NextFunction } from 'express'

import sessionService from '../service/session.service'
import HttpError from '../utils/HttpError'

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return next(HttpError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]

    if (!accessToken) {
      return next(HttpError.UnauthorizedError())
    }

    const userData = sessionService.validateAccessToken(accessToken)

    if (!userData) {
      return next(HttpError.UnauthorizedError())
    }
    next()
  } catch (e) {
    return next(HttpError.UnauthorizedError())
  }
}
