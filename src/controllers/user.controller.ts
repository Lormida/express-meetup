import { Request, Response, NextFunction } from 'express'
import { UserDTO } from '../dto/user.dto'
import userService from '../service/user.service'
import { catchAsync } from '../utils/catchAsync'

class UserController {
  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.findAllUsers()
    const usersDTO = users.map((u) => new UserDTO(u))
    res.send(usersDTO)
  })
}

const userController = new UserController()

export default userController
