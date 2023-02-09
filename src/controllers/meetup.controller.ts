import { NextFunction, Request, Response } from 'express'
import { MeetupDTO } from '../dto/meetup.dto'
import MeetupModel, { MeetupDocument } from '../model/meetup.model'
import {
  CreateMeetupAdminInput,
  CreateMeetupInput,
  DeleteMeetupAdminInput,
  GetMeetupAdminInput,
  GetMeetupInput,
  UpdateMeetupAdminInput,
  UpdateMeetupInput,
} from '../schema/meetup/meetup.schema'
import meetupService from '../service/meetup.service'
import { catchAsync } from '../utils/catchAsync'
import HttpError from '../utils/HttpError'
import { HandlerFactory } from './handlerFactory.controller'

class MeetupController {
  getAllMeetups = catchAsync(async (req: Request, res: Response) => {
    const handlerFactory = new HandlerFactory(MeetupModel)

    const converterToDTO = (meetups: MeetupDocument[]) => meetups.map((m) => new MeetupDTO(m))
    const data = await handlerFactory.getAll<MeetupDocument | null>(req.query)

    return res.status(200).send({
      length: data?.length || 0,
      data: data?.length > 0 ? converterToDTO(data as MeetupDocument[]) : [],
    })
  })

  getMeetupsByAdmin = catchAsync(async (req: Request<GetMeetupAdminInput['params']>, res: Response) => {
    const handlerFactory = new HandlerFactory(MeetupModel)
    const { userId } = req.params

    const converterToDTO = (meetups: MeetupDocument[]) => meetups.map((m) => new MeetupDTO(m))

    const data = await handlerFactory.getAll<MeetupDocument | null>(req.query, { host: userId })

    return res.status(200).send({
      length: data?.length || 0,
      data: data?.length > 0 ? converterToDTO(data as MeetupDocument[]) : [],
    })
  })

  getMeetupById = catchAsync(async (req: Request<GetMeetupInput['params']>, res: Response, next: NextFunction) => {
    const { meetupId } = req.params
    const meetup = await meetupService.findMeetup({ _id: meetupId })

    if (!meetup) {
      return next(HttpError.NotFoundError('meetup is not found!'))
    }

    return res.status(200).send(new MeetupDTO(meetup))
  })

  createMeetup = catchAsync(
    async (req: Request<{}, {}, CreateMeetupInput['body']>, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id
      const body = req.body

      const newMeetup = await meetupService.createMeetup({
        ...body,
        host: userId,
      })

      if (!newMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      return res.status(201).send(new MeetupDTO(newMeetup))
    }
  )

  createMeetupByAdmin = catchAsync(
    async (
      req: Request<CreateMeetupAdminInput['params'], {}, CreateMeetupAdminInput['body']>,
      res: Response,
      next: NextFunction
    ) => {
      const { userId } = req.params
      const body = req.body

      const newMeetup = await meetupService.createMeetup({
        ...body,
        host: userId,
      })

      if (!newMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      return res.status(201).send(new MeetupDTO(newMeetup))
    }
  )

  updateMeetupById = catchAsync(
    async (
      req: Request<UpdateMeetupInput['params'], {}, UpdateMeetupInput['body']>,
      res: Response,
      next: NextFunction
    ) => {
      const userId = res.locals.user.id
      const { meetupId } = req.params
      const update = req.body

      const meetup = await meetupService.findMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

      if (!meetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      if (String(meetup.host) !== userId) {
        return next(HttpError.NoPermissionError())
      }

      const updatedMeetup = await meetupService.findAndUpdateMeetup(
        { $and: [{ _id: meetupId }, { host: userId }] },
        update,
        {
          new: true,
        }
      )

      if (!updatedMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      res.send(200).send(new MeetupDTO(updatedMeetup))
    }
  )

  updateMeetupByAdminById = catchAsync(
    async (
      req: Request<UpdateMeetupAdminInput['params'], {}, UpdateMeetupAdminInput['params']>,
      res: Response,
      next: NextFunction
    ) => {
      const { userId, meetupId } = req.params
      const update = req.body

      const updatedMeetup = await meetupService.findAndUpdateMeetup(
        { $and: [{ _id: meetupId }, { host: userId }] },
        update,
        {
          new: true,
        }
      )

      if (!updatedMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      res.status(200).send(updatedMeetup)
    }
  )

  deleteMeetupById = catchAsync(
    async (req: Request<UpdateMeetupInput['params']>, res: Response, next: NextFunction) => {
      const userId = res.locals.user.id
      const { meetupId } = req.params

      const meetup = await meetupService.findMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

      if (!meetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      if (String(meetup.host) !== userId) {
        return next(HttpError.NoPermissionError())
      }

      const removedMeetup = await meetupService.findAndDeleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

      if (!removedMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      res.status(200).send(new MeetupDTO(removedMeetup))
    }
  )

  deleteMeetupByAdminById = catchAsync(
    async (req: Request<DeleteMeetupAdminInput['params']>, res: Response, next: NextFunction) => {
      const { userId, meetupId } = req.params

      const removedMeetup = await meetupService.findAndDeleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

      if (!removedMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      res.status(200).send(new MeetupDTO(removedMeetup))
    }
  )
}

const meetupController = new MeetupController()
export { meetupController }
