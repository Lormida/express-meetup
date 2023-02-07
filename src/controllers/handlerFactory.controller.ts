/* eslint-disable @typescript-eslint/ban-types */
import mongoose from 'mongoose'
import HttpError from '../utils/HttpError'
import { Request, Response, NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { APIFeatures } from '../utils/ApiFeature'

type TFunc<T> = (req: Request, res: Response) => T
type TFuncGetId = (req: Request, res: Response) => string
type TFuncPreMiddleware = (req: Request, res: Response) => Promise<unknown>

export class HandlerFactory<T extends mongoose.Document> {
  constructor(public model: mongoose.Model<T>) {}

  deleteOne(preMiddleware: TFuncPreMiddleware, getId: TFuncGetId) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      await preMiddleware(req, res)

      const id = getId(req, res)

      const doc = await this.model.findByIdAndDelete(id)

      if (!doc) {
        return next(new HttpError(404, 'No doc found with that ID'))
      }

      res.status(204).send({
        status: 'success',
        data: null,
      })
    })
  }

  createOne<TRequest extends Request>(executor: TFunc<object>) {
    return catchAsync(async (req: TRequest, res: Response) => {
      const additionalData = executor(req, res)
      const newDoc = await this.model.create({ ...req.body, ...additionalData })
      res.send({
        status: 'success',
        data: newDoc,
      })
    })
  }

  updateById(preMiddleware: TFuncPreMiddleware, getId: TFuncGetId) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      await preMiddleware(req, res)

      const id = getId(req, res)
      const doc = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!doc) {
        return next(new HttpError(404, 'No doc found with that ID'))
      }

      res.status(200).send({
        status: 'success',
        data: {
          doc,
        },
      })
    })
  }

  getById(getId: TFuncGetId, popOptions?: mongoose.PopulateOptions) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const id = getId(req, res)

      let docQuery
      if (popOptions) {
        docQuery = this.model.findById(id).populate(popOptions)
      } else {
        docQuery = this.model.findById(id)
      }

      const data = await docQuery
      if (!data) return next(new HttpError(404, 'No doc found with that ID'))

      res.status(200).send({
        status: 'success',
        data,
      })
    })
  }

  getAll(popOptions?: mongoose.PopulateOptions) {
    return catchAsync(async (req: Request, res: Response) => {
      let features
      if (popOptions) {
        //@ts-expect-error fix later
        features = new APIFeatures(this.model.find({}).populate(popOptions), req.query)
          .filter()
          .sort()
          .limitFields()
          .paginate()
      } else {
        //@ts-expect-error fix later
        features = new APIFeatures(this.model.find({}), req.query).filter().sort().limitFields().paginate()
      }

      const docs = await features.query

      res.send({
        status: 'success',
        length: docs.length,
        docs,
      })
    })
  }
}
