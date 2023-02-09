/* eslint-disable @typescript-eslint/ban-types */

/**
 * Potentially this class can be used to create reusable controller, but too many but
 * The main issue, that this code is badly scales (my opinion) or overengeenring
 */
import mongoose, { PopulateOptions } from 'mongoose'
import HttpError from '../utils/HttpError'
import { Request, Response, NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { APIFeatures } from '../utils/ApiFeature'

type TFunc<T> = (req: Request, res: Response) => T
type TFuncGetId = (req: Request, res: Response) => string
type TFuncPreMiddleware = (req: Request, res: Response) => Promise<unknown>

export class HandlerFactory<T extends mongoose.Document> {
  constructor(public model: mongoose.Model<T>) {}

  deleteOne = (preMiddleware: TFuncPreMiddleware, getId: TFuncGetId) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      await preMiddleware(req, res)

      const id = getId(req, res)

      const doc = await this.model.findByIdAndDelete(id)

      if (!doc) {
        return next(HttpError.NotFoundError('No doc found with that ID'))
      }

      res.status(200).send(doc)
    })

  createOne = <TRequest extends Request>(executor: TFunc<object>) =>
    catchAsync(async (req: TRequest, res: Response, next: NextFunction) => {
      const additionalData = executor(req, res)
      const newDoc = await this.model.create({ ...req.body, ...additionalData })

      if (!newDoc) {
        return next(HttpError.NotFoundError('The create operation was error '))
      }

      res.status(201).send(newDoc)
    })

  updateById = (preMiddleware: TFuncPreMiddleware, getId: TFuncGetId) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      await preMiddleware(req, res)

      const id = getId(req, res)
      const doc = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!doc) {
        return next(HttpError.NotFoundError('No doc found with that ID'))
      }

      res.status(200).send(doc)
    })

  getById = (getId: TFuncGetId, popOptions?: PopulateOptions) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const id = getId(req, res)

      let docQuery

      if (popOptions && Object.keys(popOptions).length > 0) {
        docQuery = this.model.findById(id).populate(popOptions)
      } else {
        docQuery = this.model.findById(id)
      }

      const data = await docQuery

      if (!data) {
        return next(HttpError.NotFoundError('No doc found with that ID'))
      }

      res.status(200).send(data)
    })

  getAll = async <T>(reqQuery: object, findQuery: object = {}, popOptions?: PopulateOptions) => {
    let features

    if (popOptions && Object.keys(popOptions).length > 0) {
      features = new APIFeatures(this.model.find(findQuery).populate(popOptions), reqQuery)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    } else {
      features = new APIFeatures(this.model.find(findQuery), reqQuery).filter().sort().limitFields().paginate()
    }

    const docs = (await features.query) as T[]

    return docs
  }
}
