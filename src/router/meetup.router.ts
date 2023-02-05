import { Router} from 'express'
import { meetupController } from '../controllers/meetup.controller'
const router = Router()

// router.use(authController.isAuth)

router.get('/meetups', meetupController.getAllMeetups)
router.get('/meetup/:id', meetupController.getMeetupById)

router.post('/create-meetup', meetupController.createMeetup)
router.put('/meetup/:id', meetupController.updateMeetupById)
router.delete('/meetup/:id', meetupController.deleteMeetupById)

export { router as meetupRouter}
