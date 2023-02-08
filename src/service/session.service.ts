import config from 'config'
import jwt from 'jsonwebtoken'
import { UserDTO } from '../dto/user.dto'
import sessionModel from '../model/sesssion.model'

const JWT_ACCESS_SECRET = config.get<string>('JWT_ACCESS_SECRET')
const JWT_REFRESH_SECRET = config.get<string>('JWT_REFRESH_SECRET')

const ACCESS_TOKEN_EXPIRATION = config.get<string>('ACCESS_TOKEN_EXPIRATION')
const REFRESH_TOKEN_EXPIRATION = config.get<string>('REFRESH_TOKEN_EXPIRATION')

class SessionService {
  generateTokens = (payload: UserDTO) => ({
    accessToken: jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }),
    refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    }),
  })

  validateAccessToken = (token: string) => {
    try {
      const userData = jwt.verify(token, JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken = (token: string) => {
    try {
      const userData = jwt.verify(token, JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      console.log('Refresh token is expired?')
      return null
    }
  }

  saveToken = async (userId: string, refreshToken: string) => {
    const tokenData = await sessionModel.findOne({ user: userId })

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    return sessionModel.create({ user: userId, refreshToken })
  }

  removeToken = (refreshToken: string) => sessionModel.deleteOne({ refreshToken })

  findToken = (refreshToken: string) => sessionModel.findOne({ refreshToken })
}

const sessionService = new SessionService()
export default sessionService
