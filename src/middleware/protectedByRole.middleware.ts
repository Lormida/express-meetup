import { NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { elementIsIncluded, extractRoles } from '../utils/helpers'
import HttpError from '../utils/HttpError'

export const protectByRoles = (...protectedRoles: any[]) =>
  catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    //@ts-expect-error fix later
    const { roles } = res.locals.user

    const _roles = extractRoles(roles)

    if (!_roles || !elementIsIncluded(protectedRoles, _roles)) {
      next(
        new HttpError(
          405,
          `Error role (${_roles.join(',')}), but require (${protectedRoles.join(
            ','
          )}).You don't have permission to given operation!`
        )
      )
    }

    next()
  })
