import UserModel from '../model/user.model'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import userModel, { UserDocument } from '../model/user.model'

class UserService {
  /** Function is not using - instead of it is using HandlerFactory getAll */
  // findAllUsers = (options: QueryOptions = {}) => UserModel.find({}, options)

  findUser = (query: FilterQuery<UserDocument>, options: QueryOptions = { lean: true }) =>
    UserModel.findOne(query, {}, options)

  findAndUpdateUser = (query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>, options: QueryOptions) =>
    UserModel.findOneAndUpdate(query, update, options)

  findAndDeleteUser = (query: FilterQuery<UserDocument>) => userModel.findOneAndDelete(query)
}

const userService = new UserService()
export default userService
