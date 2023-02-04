export default class HttpError extends Error {
  message: string
  statusCode: number
 
  constructor(msg:string, statusCode = 500) {
    super(msg)

    this.message = msg
    this.statusCode = statusCode
  }
}

