import { Request, Response, NextFunction } from 'express'
import sessionService from '../service/session.service'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    return next()
  }

  const accessToken = authorizationHeader.split(' ')[1]

  if (!accessToken) {
    return next()
  }

  res.locals.user = sessionService.validateAccessToken(accessToken)

  return next()
}

export default deserializeUser
