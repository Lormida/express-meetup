export default class HttpError extends Error {
  statusCode: number
  errors: string[]

  constructor(statusCode: number, message: string, errors = []) {
    super(message)

    this.statusCode = statusCode
    this.errors = errors
  }
  static BadRequestError(message: string, errors = []) {
    return new HttpError(400, message, errors)
  }

  static UnauthorizedError() {
    return new HttpError(401, 'User is not authorized')
  }

  static NoPermissionError() {
    return new HttpError(403, `User doesn't have the permission to given operation`)
  }

  static NotFoundError(message: string) {
    return new HttpError(404, message)
  }
}
