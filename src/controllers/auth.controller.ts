import { Request, Response, NextFunction } from 'express'
import authService from '../service/auth.service'
import HttpError from '../utils/HttpError'
import RoleModel from '../model/role.model'
import { catchAsync } from '../utils/catchAsync'
import { setCookie } from '../utils/helpers'
import { UserRole } from '../schema/user/user.schema'

const registrationUser = (role: keyof typeof UserRole) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body

    const userRole = await RoleModel.findOne({ value: role })

    if (!userRole) {
      return next(HttpError.BadRequestError('User role not found'))
    }

    const userData = await authService.registration(email, name, password, [userRole._id])
    setCookie(res, 'refreshToken', userData.refreshToken)

    res.status(201).send(userData)
  })

class UserController {
  registration = (role: keyof typeof UserRole) => registrationUser(role)

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const userData = await authService.login(email, password)
    setCookie(res, 'refreshToken', userData.refreshToken)

    res.status(200).send(userData)
  })

  logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies
    const token = await authService.logout(refreshToken)

    if (!token) {
      return next(HttpError.BadRequestError('Some error during deleting refresh token'))
    }

    res.clearCookie('refreshToken')
    return res.sendStatus(204)
  })

  refresh = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies
    const userData = await authService.refresh(refreshToken)

    if (!userData) {
      return next(HttpError.UnauthorizedError())
    }

    setCookie(res, 'refreshToken', userData.refreshToken)

    res.status(200).send(userData)
  })
}

const userController = new UserController()

export default userController
