import { UserDto } from '../dto/User.dto'
import UserModel, { UserDocument } from '../model/user.model'
import HttpError from '../utils/HttpError'
import sessionService from './session.service'

class AuthService {
  createSession = async (user: UserDocument) => {
    const userDto = new UserDto(user)

    const tokens = sessionService.generateTokens({ ...userDto })
    await sessionService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  registration = async (email: string, name: string, password: string, roles: string[]) => {
    const candidate = await UserModel.findOne({ email })

    if (candidate) {
      throw HttpError.BadRequestError(`User with ${email} already exists`)
    }

    const user = await UserModel.create({ email, name, password, roles })

    return this.createSession(user)
  }

  login = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email })

    if (!user) {
      throw HttpError.BadRequestError('User with such email is not found')
    }

    const isPasswordsEqual = await user.comparePassword(password)

    if (!isPasswordsEqual) {
      throw HttpError.BadRequestError('Wrong password')
    }

    return this.createSession(user)
  }

  refresh = async (refreshToken: string) => {
    if (!refreshToken) {
      throw HttpError.UnauthorizedError()
    }

    const userData = sessionService.validateRefreshToken(refreshToken) as {
      id: string
    }
    const tokenFromDb = await sessionService.findToken(refreshToken)

    if (!userData?.id || !tokenFromDb) {
      throw HttpError.UnauthorizedError()
    }

    const user = await UserModel.findById(userData.id)

    if (user) {
      return this.createSession(user)
    }

    // TODO: fix it
    return null
  }

  logout = (refreshToken: string) => sessionService.removeToken(refreshToken)
}

const authService = new AuthService()
export default authService
