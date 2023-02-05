import { Router } from 'express'
import { meetupController } from '../controllers/meetup.controller'
import validateResource from '../middleware/validateResource'
import { createMeetupSchema, deleteMeetupSchema, getMeetupSchema, updateMeetupSchema } from '../schema/meetup.schema'
const router = Router()

// router.use(authController.isAuth)

router.get('/meetups', meetupController.getAllMeetups)

router.get('/meetup/:id',
  [validateResource(getMeetupSchema)],
  meetupController.getMeetupById)

router.post('/create-meetup',
  [validateResource(createMeetupSchema)],
  meetupController.createMeetup
)

router.put('/meetup/:id',
  [validateResource(updateMeetupSchema)],
  meetupController.updateMeetupById
)

router.delete('/meetup/:id',
  [validateResource(deleteMeetupSchema)],
  meetupController.deleteMeetupById
)

export { router as meetupRouter }
