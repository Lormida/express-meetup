import { NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync'
import HttpError from '../utils/HttpError'

function elementIsIncluded(mainArray: unknown[], secondArray: unknown[]): boolean {
  return mainArray.some((element) => secondArray.includes(element))
}

export const protectByRoles = (...protectedRoles: any[]) => {
  return catchAsync(function (req: Request, res: Response, next: NextFunction) {
    return new Promise((resolve, reject) => {
      //@ts-expect-error fix later
      const { roles } = res.locals.user

      const _roles = roles.map((el: { value: string }) => el.value)

      if (!_roles || !elementIsIncluded(protectedRoles, _roles)) {
        return reject(
          new HttpError(
            405,
            `Error role (${_roles.join(',')}), but require (${protectedRoles.join(
              ','
            )}).You don't have permission to given operation!`
          )
        )
      }
      resolve(next())
    })
  })
}
