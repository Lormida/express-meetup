import { Request, Response } from 'express'
import Meetup from '../model/meetup.model'
import { CreateMeetupInput, GetMeetupInput, UpdateMeetupInput } from '../schema/meetup.schema'
import meetupService from '../service/meetup.service'
import { HandlerFactory } from './handlerFactory.controller'

class MeetupController {
  getAllMeetups() {
    const handlerFactory = new HandlerFactory(Meetup)
    return handlerFactory.getAll()
  }

  async getMeetupById(req: Request<GetMeetupInput['params']>, res: Response) {
    const meetupId = req.params.meetupId
    const meetup = await meetupService.findMeetup({ _id: meetupId })

    if (!meetup) {
      return res.sendStatus(404)
    }

    return res.send(meetup)
  }
  async createMeetup(req: Request<{}, {}, CreateMeetupInput['body']>, res: Response) {
    const userId = res.locals.user.id
    const body = req.body

    const newMeetup = await meetupService.createMeetup({
      ...body,
      host: userId,
    })

    return res.send(newMeetup)
  }

  //TODO: fix req type
  async createMeetupByAdmin(req: Request<{}, {}, CreateMeetupInput['body']>, res: Response) {
    //@ts-expect-error fix later
    const userId = req.params.userId
    const body = req.body

    const newMeetup = await meetupService.createMeetup({
      ...body,
      host: userId,
    })

    return res.send(newMeetup)
  }
  async updateMeetupById(req: Request<UpdateMeetupInput['params']>, res: Response) {
    const userId = res.locals.user.id

    const meetupId = req.params.meetupId
    const update = req.body

    const meetup = await meetupService.findMeetup({ _id: meetupId })

    if (!meetup) {
      return res.sendStatus(404)
    }

    if (String(meetup.host) !== userId) {
      return res.sendStatus(403)
    }

    const updatedMeetup = await meetupService.findAndUpdateMeetup({ _id: meetupId }, update, {
      new: true,
    })

    return res.send(updatedMeetup)
  }
  async deleteMeetupById(req: Request<UpdateMeetupInput['params']>, res: Response) {
    const userId = res.locals.user.id
    const meetupId = req.params.meetupId

    const meetup = await meetupService.findMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

    if (!meetup) {
      return res.sendStatus(404)
    }

    if (String(meetup.host) !== userId) {
      return res.sendStatus(403)
    }

    await meetupService.deleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })

    return res.sendStatus(200)
  }

  // TODO: fix req type
  async deleteMeetupByAdminById(req: Request<UpdateMeetupInput['params']>, res: Response) {
    //@ts-expect-error fix later
    const userId = req.params.userId
    const meetupId = req.params.meetupId

    const meetup = await meetupService.deleteMeetup({ $and: [{ _id: meetupId }, { host: userId }] })
    console.log('was deleted', meetup)

    return res.sendStatus(200)
  }
}

const meetupController = new MeetupController()
export { meetupController }
