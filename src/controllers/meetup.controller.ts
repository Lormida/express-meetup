import { Request, Response } from 'express'
import Meetup from '../model/meetup.model'

class MeetupController {
  async getAllMeetups(req: Request, res: Response) {
    const allMeetups = await Meetup.find()
    return res.json(allMeetups)
  }  
  async getMeetupById(req: Request, res: Response) {
  }
  async createMeetup(req: Request, res: Response) {
  }
  async updateMeetupById(req: Request, res: Response) {
  }
  async deleteMeetupById(req: Request, res: Response) {
  }
}


const meetupController = new MeetupController()
export { meetupController }