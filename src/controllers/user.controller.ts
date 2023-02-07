import { Request, Response, NextFunction } from 'express'
import userService from '../service/user.service'
import HttpError from '../utils/HttpError'
import RoleModel from '../model/role.model'

//TODO: fix types later
function registrationUser(role: 'USER' | 'ADMIN') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('role registration is', role)

      const { email, name, password } = req.body

      const userRole = await RoleModel.findOne({ value: role })

      if (!userRole) throw HttpError.BadRequest('User role not found')

      const userData = await userService.registration(email, name, password, [userRole._id])
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.send(userData)
    } catch (e) {
      next(e)
    }
  }
}

class UserController {
  registration(role: 'USER' | 'ADMIN') {
    return registrationUser(role)
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      const userData = await userService.login(email, password)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.send(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.send(token)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)

      // TODO: chech is it's possible
      if (!userData) {
        throw HttpError.UnauthorizedError()
      }
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.send(userData)
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.findAllUsers()
      return res.send(users)
    } catch (e) {
      next(e)
    }
  }
}

const userController = new UserController()

export default userController
