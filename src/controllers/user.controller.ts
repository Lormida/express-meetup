import { Request, Response, NextFunction } from 'express'
import { UserDTO } from '../dto/user.dto'
import UserModel, { UserDocument } from '../model/user.model'
import { GetUserInput, UpdateUserInput } from '../schema/user/user.schema'
import userService from '../service/user.service'
import { catchAsync } from '../utils/catchAsync'
import HttpError from '../utils/HttpError'
import { HandlerFactory } from './handlerFactory.controller'

class UserController {
  getAllUsers = catchAsync(async (req: Request<GetUserInput['params']>, res: Response) => {
    const handlerFactory = new HandlerFactory(UserModel)

    const converterToDTO = (users: UserDocument[]) => users.map((m) => new UserDTO(m))

    const data = await handlerFactory.getAll<UserDocument | null>(req.query)

    return res.status(200).send({
      length: data?.length || 0,
      data: data?.length && converterToDTO(data as UserDocument[]),
    })
  })

  getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id
    const user = await userService.findUser({ _id: userId })

    if (!user) {
      return next(HttpError.NotFoundError('user is not found!'))
    }

    return res.status(200).send(new UserDTO(user))
  })

  getUserById = catchAsync(async (req: Request<GetUserInput['params']>, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const user = await userService.findUser({ _id: userId })

    if (!user) {
      return next(HttpError.NotFoundError('user is not found!'))
    }

    return res.status(200).send(new UserDTO(user))
  })

  updateUser = catchAsync(async (req: Request<{}, {}, UpdateUserInput['body']>, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id
    const update = req.body

    const updatedUser = await userService.findAndUpdateUser({ _id: userId }, update, {
      new: true,
    })

    if (!updatedUser) {
      return next(HttpError.NotFoundError('user is not found!'))
    }

    res.status(200).send(new UserDTO(updatedUser))
  })

  deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id
    const removedUser = await userService.findAndDeleteUser({ _id: userId })

    if (!removedUser) {
      return next(HttpError.NotFoundError('user is not found!'))
    }

    res.status(200).send(new UserDTO(removedUser))
  })
}

const userController = new UserController()

export default userController
