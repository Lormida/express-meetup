import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'
import HttpError from '../utils/HttpError'

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return next(new HttpError(400, e?.errors[0].message))
  }
}

export default validate
