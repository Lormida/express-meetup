import UserModel from '../model/user.model'
import { QueryOptions } from 'mongoose'

class UserService {
  findAllUsers = (options: QueryOptions = {}) => UserModel.find({}, options)
}

const userService = new UserService()
export default userService
