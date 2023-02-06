export default class HttpError extends Error {
  statusCode: number
  errors: string[]

  constructor(statusCode: number, message: string, errors = []) {
    super(message)

    this.statusCode = statusCode
    this.errors = errors
  }

  static UnauthorizedError() {
    return new HttpError(401, 'Пользователь не авторизован')
  }

  static BadRequest(message: string, errors = []) {
    return new HttpError(400, message, errors)
  }
}
