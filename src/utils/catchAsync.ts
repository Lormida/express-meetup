import { NextFunction, Request, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/ban-types
const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next).catch((e: { message: string }) => {
    console.log('intercepts in catchAsync', e.message)
    return next(e)
  })

export { catchAsync }
