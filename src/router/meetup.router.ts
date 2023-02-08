import { Router } from 'express'
import { meetupController } from '../controllers/meetup.controller'
import { isAuth } from '../middleware/isAuth.middleware'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
import validateResource from '../middleware/validateResource.middleware'
import {
  createMeetupSchema,
  deleteMeetupSchema,
  getMeetupSchema,
  updateMeetupSchema,
} from '../schema/meetup/meetup.schema'
const router = Router()

router.use(isAuth)

/**
 * @openapi
 * '/api/meetups':
 *  get:
 *     tags:
 *     - Meetups
 *     summary: Get all meetups
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/Meetups'
 */
router.get('/meetups', meetupController.getAllMeetups())

/**
 * @openapi
 * '/api/meetups/{meetupId}':
 *  get:
 *     tags:
 *     - Meetups
 *     summary: Get all meetups
 *     parameters:
 *      - name: meetupId
 *        in: path
 *        description: The id of the product
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schema/Meetup'
 *       404:
 *         description: Failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupNotFound'
 *
 */
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
router.patch(
  '/meetup/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(updateMeetupSchema)],
  meetupController.updateMeetupByAdminById
)

router.delete(
  '/meetup/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(deleteMeetupSchema)],
  meetupController.deleteMeetupByAdminById
)

export { router as meetupRouter }
