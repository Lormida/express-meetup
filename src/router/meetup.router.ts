import { Router } from 'express'
import { meetupController } from '../controllers/meetup.controller'
import validateResource from '../middleware/validateResource.middleware'
import { createMeetupSchema, deleteMeetupSchema, getMeetupSchema, updateMeetupSchema } from '../schema/meetup.schema'
const router = Router()

// router.use(authController.isAuth)

router.get('/meetups', meetupController.getAllMeetups)

router.get('/meetup/:meetupId',
  [validateResource(getMeetupSchema)],
  meetupController.getMeetupById)

router.post('/create-meetup',
  [validateResource(createMeetupSchema)],
  meetupController.createMeetup
)

router.put('/meetup/:meetupId',
  [validateResource(updateMeetupSchema)],
  meetupController.updateMeetupById
)

router.delete('/meetup/:meetupId',
  [validateResource(deleteMeetupSchema)],
  meetupController.deleteMeetupById
)

export { router as meetupRouter }
