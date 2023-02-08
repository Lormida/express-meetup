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
 *            schema:
 *              $ref: '#/components/schema/Meetups'
 */
router.get('/meetups', meetupController.getAllMeetups())

/**
 * @openapi
 * '/api/meetup/{meetupId}':
 *  get:
 *     tags:
 *     - Meetup
 *     summary: Get meetup by id
 *     parameters:
 *      - name: meetupId
 *        in: path
 *        description: The id of the meetup
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schema/Meetup'
 *       404:
 *         description: "Error: Not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupNotFound'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 *       400:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupBadRequest'
 */
router.get('/meetup/:meetupId', [validateResource(getMeetupSchema)], meetupController.getMeetupById)

/**
 * @openapi
 * '/api/meetup':
 *  post:
 *     tags:
 *     - Meetup
 *     summary: Create a meetup
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schema/CreateMeetupInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/CreateMeetupResponse'
 *      400:
 *        description: Bad request
 */
router.post('/meetup', [validateResource(createMeetupSchema)], meetupController.createMeetup)

/**
 * @openapi
 * '/api/meetup/{meetupId}':
 *  patch:
 *     tags:
 *     - Meetup
 *     summary: Create a meetup
 *     parameters:
 *      - name: meetupId
 *        in: path
 *        description: The id of the meetup
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schema/PatchMeetupInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/PatchMeetupResponse'
 *      400:
 *        description: Bad request
 */
router.patch('/meetup/:meetupId', [validateResource(updateMeetupSchema)], meetupController.updateMeetupById)

/**
 * @openapi
 * '/api/meetup/{meetupId}':
 *  delete:
 *     tags:
 *     - Meetup
 *     summary: Delete meetup by id
 *     parameters:
 *      - name: meetupId
 *        in: path
 *        description: The id of the meetup
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schema/Meetup'
 *       404:
 *         description: "Error: Not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupNotFound'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 *       400:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupBadRequest'
 *
 */
router.delete('/meetup/:meetupId', [validateResource(deleteMeetupSchema)], meetupController.deleteMeetupById)

// Admin
router.post(
  '/meetups/:userId',
  [protectByRoles('ADMIN'), validateResource(createMeetupSchema)],
  meetupController.createMeetupByAdmin
)
router.patch(
  '/meetups/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(updateMeetupSchema)],
  meetupController.updateMeetupByAdminById
)

router.delete(
  '/meetups/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(deleteMeetupSchema)],
  meetupController.deleteMeetupByAdminById
)

export { router as meetupRouter }
