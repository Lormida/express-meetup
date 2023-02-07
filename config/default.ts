import dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  dbURI: 'mongodb+srv://lormida:midapa24@cluster0.oien5qs.mongodb.net/test',
  JWT_ACCESS_SECRET: 'jwt-secret-key',
  JWT_REFRESH_SECRET: 'jwt-refresh-secret-key',
  ACCESS_TOKEN_EXPIRATION: '4h',
  REFRESH_TOKEN_EXPIRATION: '24h',
}
