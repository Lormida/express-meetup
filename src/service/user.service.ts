import { UserDto } from "../dto/User.dto";
import UserModel, { UserDocument } from "../model/user.model";
import HttpError from "../utils/HttpError";
import sessionService from "./session.service";
import bcrypt from 'bcrypt'
import { QueryOptions } from "mongoose";

class UserService {
  async createSession(user: UserDocument) {
    const userDto = new UserDto(user);
    const tokens = sessionService.generateTokens({ ...userDto });
    await sessionService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto }
  }
  async registration(email: string, password: string) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw HttpError.BadRequest(`User with ${email} already exists`)
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ email, password: hashPassword })

    return this.createSession(user)
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw HttpError.BadRequest('User with such email is not found')
    }
    const isPasswordsEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordsEqual) {
      throw HttpError.BadRequest('Wrong password');
    }
    return this.createSession(user)
  }

  async logout(refreshToken: string) {
    const token = await sessionService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw HttpError.UnauthorizedError();
    }
    const userData = sessionService.validateRefreshToken(refreshToken) as { id: string };
    const tokenFromDb = await sessionService.findToken(refreshToken);
    if (!userData?.id || !tokenFromDb) {
      throw HttpError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);

    if (user) {
      return this.createSession(user)
    }
    // TODO: fix it
    return null
  }

  async findAllUsers(
    options: QueryOptions = { lean: true }
  ) {
    return UserModel.find({}, options);

  }
}

const userService = new UserService();
export default userService

