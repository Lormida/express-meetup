import { Router } from 'express'
import { meetupController } from '../controllers/meetup.controller'
import { isAuth } from '../middleware/isAuth.middleware'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
import validateResource from '../middleware/validateResource.middleware'
import { createMeetupSchema, deleteMeetupSchema, getMeetupSchema, updateMeetupSchema } from '../schema/meetup.schema'
const router = Router()

router.use(isAuth)

router.get('/meetups', meetupController.getAllMeetups())
router.get('/meetup/:meetupId', [validateResource(getMeetupSchema)], meetupController.getMeetupById)

router.post('/create-meetup', [validateResource(createMeetupSchema)], meetupController.createMeetup)
router.patch('/meetup/:meetupId', [validateResource(updateMeetupSchema)], meetupController.updateMeetupById)
router.delete('/meetup/:meetupId', [validateResource(deleteMeetupSchema)], meetupController.deleteMeetupById)

// Admin
router.post(
  '/create-meetup/:userId',
  [protectByRoles('ADMIN'), validateResource(createMeetupSchema)],
  meetupController.createMeetupByAdmin
)
router.delete(
  '/meetup/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(deleteMeetupSchema)],
  meetupController.deleteMeetupByAdminById
)

export { router as meetupRouter }
