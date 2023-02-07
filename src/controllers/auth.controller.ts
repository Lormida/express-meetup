import { Request, Response } from 'express'
import authService from '../service/auth.service'
import HttpError from '../utils/HttpError'
import RoleModel from '../model/role.model'
import { catchAsync } from '../utils/catchAsync'
import { setCookie } from '../utils/helpers'

const registrationUser = (role: 'USER' | 'ADMIN') =>
  catchAsync(async (req: Request, res: Response) => {
    const { email, name, password } = req.body

    const userRole = await RoleModel.findOne({ value: role })
    if (!userRole) throw HttpError.BadRequestError('User role not found')

    const userData = await authService.registration(email, name, password, [userRole._id])

    setCookie(res, 'refreshToken', userData.refreshToken)

    res.send(userData)
  })

class UserController {
  registration(role: 'USER' | 'ADMIN') {
    return registrationUser(role)
  }

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const userData = await authService.login(email, password)
    setCookie(res, 'refreshToken', userData.refreshToken)

    res.send(userData)
  })

  logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const token = await authService.logout(refreshToken)

    res.clearCookie('refreshToken')
    res.send(token)
  })

  refresh = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const userData = await authService.refresh(refreshToken)

    if (!userData) throw HttpError.UnauthorizedError()

    setCookie(res, 'refreshToken', userData.refreshToken)

    res.send(userData)
  })
}

const userController = new UserController()

export default userController
