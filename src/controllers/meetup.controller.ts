import { Request, Response } from 'express'
import Meetup from '../model/meetup.model'
import { CreateMeetupInput, GetMeetupInput, UpdateMeetupInput } from '../schema/meetup.schema'
import meetupService from '../service/meetup.service'
import { catchAsync } from '../utils/catchAsync'
import { HandlerFactory } from './handlerFactory.controller'

class MeetupController {
  getAllMeetups = () => {
    const handlerFactory = new HandlerFactory(Meetup)
    // TODO: add populating options
    return handlerFactory.getAll()
  }

  getMeetupById = catchAsync(async (req: Request<GetMeetupInput['params']>, res: Response) => {
    const { meetupId } = req.params
    const meetup = await meetupService.findMeetup({ _id: meetupId })

    if (!meetup) return res.sendStatus(404)

    return res.send(meetup)
  })

  createMeetup = catchAsync(async (req: Request<{}, {}, CreateMeetupInput['body']>, res: Response) => {
    const userId = res.locals.user.id
    const body = req.body

    const newMeetup = await meetupService.createMeetup({
      ...body,
      host: userId,
    })

    return res.send(newMeetup)
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

    return res.send(newMeetup)
  })

  updateMeetupById = catchAsync(async (req: Request<UpdateMeetupInput['params']>, res: Response) => {
    const userId = res.locals.user.id
    const { meetupId } = req.params
    const update = req.body

    const meetup = await meetupService.findMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

    if (!meetup) return res.sendStatus(404)
    if (String(meetup.host) !== userId) return res.sendStatus(403)

    const updatedMeetup = await meetupService.findAndUpdateMeetup(
      { $and: [{ _id: meetupId }, { host: userId }] },
      update,
      {
        new: true,
      }
    )

    return res.send(updatedMeetup)
  })

  updateMeetupByAdminById = catchAsync(async (req: Request<UpdateMeetupInput['params']>, res: Response) => {
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

    return res.send(updatedMeetup)
  })

  deleteMeetupById = catchAsync(async (req: Request<UpdateMeetupInput['params']>, res: Response) => {
    const userId = res.locals.user.id
    const { meetupId } = req.params

    const meetup = await meetupService.findMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

    if (!meetup) return res.sendStatus(404)
    if (String(meetup.host) !== userId) return res.sendStatus(403)

    const removedMeetup = await meetupService.findAndDeleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

    return res.status(200).json({
      status: 'success',
      data: removedMeetup,
    })
  })

  deleteMeetupByAdminById = catchAsync(async (req: Request<UpdateMeetupInput['params']>, res: Response) => {
    //@ts-expect-error fix later
    const { userId, meetupId } = req.params

    const removedMeetup = await meetupService.findAndDeleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

    return res.status(200).json({
      status: 'success',
      data: removedMeetup,
    })
  })
}

const meetupController = new MeetupController()
export { meetupController }
