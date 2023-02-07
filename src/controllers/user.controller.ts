import { Request, Response, NextFunction } from 'express'
import userService from '../service/user.service'
import { catchAsync } from '../utils/catchAsync'

class UserController {
  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.findAllUsers()
    res.send(users)
  })
}

const userController = new UserController()

export default userController
