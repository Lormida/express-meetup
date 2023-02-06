import mongoose from 'mongoose'
import HttpError from '../utils/HttpError'
import { Request, Response, NextFunction } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { APIFeatures } from '../utils/ApiFeature'

export class HandlerFactory<T extends mongoose.Document> {
  deleteOne<TRequest extends { params: { id: string } }>(Model: mongoose.Model<T>) {
    return catchAsync(async (req: TRequest, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndDelete(req.params.id)
      if (!doc) {
        return next(new HttpError(404, 'No doc found with that ID'))
      }

      res.status(204).json({
        status: 'success',
        data: null,
      })
    })
  }

  createOne<TRequest extends { body: Record<string, unknown> }>(Model: mongoose.Model<T>) {
    return catchAsync(async (req: TRequest, res: Response) => {
      const newDoc = await Model.create(req.body)
      res.json({
        status: 'success',
        data: newDoc,
      })
    })
  }

  updateById<TRequest extends { params: { id: string }; body: Record<string, unknown> }>(Model: mongoose.Model<T>) {
    return catchAsync(async (req: TRequest, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!doc) {
        return next(new HttpError(404, 'No doc found with that ID'))
      }

      res.status(200).json({
        status: 'success',
        data: {
          doc,
        },
      })
    })
  }

  getById<TRequest extends { params: { id: string } }>(
    Model: mongoose.Model<T>,
    popOptions?: mongoose.PopulateOptions
  ) {
    return catchAsync(async (req: TRequest, res: Response, next: NextFunction) => {
      const docQuery = Model.findById(req.params.id).populate(popOptions || ({} as mongoose.PopulateOptions))

      const data = await docQuery
      if (!data) return next(new HttpError(404, 'No doc found with that ID'))

      res.status(200).json({
        status: 'success',
        data,
      })
    })
  }

  getAll(Model: mongoose.Model<T>, popOptions?: mongoose.PopulateOptions) {
    return catchAsync(async (req: Request, res: Response) => {
      const features = new APIFeatures(
        Model.find({}).populate(popOptions || ({} as mongoose.PopulateOptions)),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate()

      const docs = await features.query

      res.json({
        status: 'success',
        length: docs.length,
        docs,
      })
    })
  }
}
