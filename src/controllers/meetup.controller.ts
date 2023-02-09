import { NextFunction, Request, Response } from 'express'
import { MeetupDTO } from '../dto/meetup.dto'
import MeetupModel, { MeetupDocument } from '../model/meetup.model'
import { CreateMeetupInput, GetMeetupInput, UpdateMeetupInput } from '../schema/meetup/meetup.schema'
import meetupService from '../service/meetup.service'
import { catchAsync } from '../utils/catchAsync'
import HttpError from '../utils/HttpError'
import { HandlerFactory } from './handlerFactory.controller'

class MeetupController {
  getAllMeetups = catchAsync(async (req: Request<GetMeetupInput['params']>, res: Response) => {
    const handlerFactory = new HandlerFactory(MeetupModel)

    const converterToDTO = (meetups: MeetupDocument[]) => meetups.map((m) => m && new MeetupDTO(m))
    // TODO: add populating options

    const data = await handlerFactory.getAll<MeetupDocument | null>(req.query)

    return res.send({
      length: data?.length || 0,
      data: data?.length && converterToDTO(data as MeetupDocument[]),
    })
  })

  //TODO: fix type
  getMeetupsByAdmin = catchAsync(async (req: Request<GetMeetupInput['params']>, res: Response) => {
    const handlerFactory = new HandlerFactory(MeetupModel)
    //@ts-expect-error fix later
    const { userId } = req.params

    const converterToDTO = (meetups: MeetupDocument[]) => meetups.map((m) => m && new MeetupDTO(m))
    // TODO: add populating options

    const data = await handlerFactory.getAll<MeetupDocument | null>(req.query, { host: userId })

    return res.send({
      length: data?.length || 0,
      data: data?.length && converterToDTO(data as MeetupDocument[]),
    })
  })

  getMeetupById = catchAsync(async (req: Request<GetMeetupInput['params']>, res: Response, next: NextFunction) => {
    const { meetupId } = req.params
    const meetup = await meetupService.findMeetup({ _id: meetupId })

    if (!meetup) {
      return next(HttpError.NotFoundError('meetup is not found!'))
    }

    return res.send(new MeetupDTO(meetup))
  })

  createMeetup = catchAsync(async (req: Request<{}, {}, CreateMeetupInput['body']>, res: Response) => {
    const userId = res.locals.user.id
    const body = req.body

    const newMeetup = await meetupService.createMeetup({
      ...body,
      host: userId,
    })
    // TODO : add error case

    return res.send(new MeetupDTO(newMeetup))
  })

  //TODO: fix req type
  createMeetupByAdmin = catchAsync(async (req: Request<{}, {}, CreateMeetupInput['body']>, res: Response) => {
    //@ts-expect-error fix later
    const { userId } = req.params
    const body = req.body

    const newMeetup = await meetupService.createMeetup({
      ...body,
      host: userId,
    })
    //TODO: add error case

    return res.send(new MeetupDTO(newMeetup))
  })

  updateMeetupById = catchAsync(
    async (req: Request<UpdateMeetupInput['params']>, res: Response, next: NextFunction) => {
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

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      res.send(new MeetupDTO(updatedMeetup!))
    }
  )

  updateMeetupByAdminById = catchAsync(
    async (req: Request<UpdateMeetupInput['params']>, res: Response, next: NextFunction) => {
      //@ts-expect-error fix later
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

      res.send(updatedMeetup)
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

      // Meetup wasn't found
      if (!removedMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      res.status(200).send(new MeetupDTO(removedMeetup))
    }
  )

  deleteMeetupByAdminById = catchAsync(
    async (req: Request<UpdateMeetupInput['params']>, res: Response, next: NextFunction) => {
      //@ts-expect-error fix later
      const { userId, meetupId } = req.params

      const removedMeetup = await meetupService.findAndDeleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

      // Meetup wasn't found
      if (!removedMeetup) {
        return next(HttpError.NotFoundError('meetup is not found!'))
      }

      res.status(200).send(new MeetupDTO(removedMeetup))
    }
  )
}

const meetupController = new MeetupController()
export { meetupController }
