import { Request, Response, NextFunction } from 'express'
import { UserDto } from '../dto/User.dto'
import userService from '../service/user.service'
import { catchAsync } from '../utils/catchAsync'

class UserController {
  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.findAllUsers()
    const usersDTO = users.map((u) => new UserDto(u))
    res.send(usersDTO)
  })
}

const userController = new UserController()

export default userController
