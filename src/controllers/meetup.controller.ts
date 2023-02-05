import { Request, Response } from 'express'
import Meetup from '../model/meetup.model'
import Role from '../model/role.model'

class MeetupController {
  async getAllMeetups(req: Request, res: Response) {
    const allMeetups = await Meetup.find()
    return res.json(allMeetups)
  }
  async createMeetup(req: Request, res: Response) {
    const userRole = new Role({ value: 'USER' })
    const adminRole = new Role({ value: 'ADMIN' })
    const a = await userRole.save()
    const b = await adminRole.save()

    return res.json([a, b])
  }

}


const meetupController = new MeetupController()
export { meetupController }