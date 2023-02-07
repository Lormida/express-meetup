import { Request, Response, NextFunction } from 'express'
import userService from '../service/user.service'

class UserController {
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
