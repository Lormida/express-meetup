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
router.get('/meetups', meetupController.getAllMeetups)

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
 *       400:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupBadRequest'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'

 *       403:
 *         description: "Error: Permission denied"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNoPermission'
 *       404:
 *         description: "Error: Not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupNotFound'
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
 *              $ref: '#/components/schema/MeetupResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 */
router.post('/meetup', [validateResource(createMeetupSchema)], meetupController.createMeetup)

/**
 * @openapi
 * '/api/meetup/{meetupId}':
 *  patch:
 *     tags:
 *     - Meetup
 *     summary: Update a meetup
 *     parameters:
 *      - name: meetupId
 *        in: path
 *        description: The id of the modifying meetup
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
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 *      403:
 *        description: "Error: Permission denied"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNoPermission'
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
 *       400:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupBadRequest'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 *       403:
 *         description: "Error: Permission denied"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNoPermission'
 *       404:
 *         description: "Error: Not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupNotFound'
 */
router.delete('/meetup/:meetupId', [validateResource(deleteMeetupSchema)], meetupController.deleteMeetupById)

/** -------------------------------------------------------------------------------------------------------------- */

// Admin

/**
 * @openapi
 * '/api/meetups/{userId}':
 *  get:
 *     tags:
 *     - Meetups (admin)
 *     summary: Get all meetups of user (by admin)
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/Meetups'
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 *      403:
 *        description: "Error: Permission denied"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNoPermission'
 */
router.get('/meetups/:userId', meetupController.getMeetupsByAdmin)

/**
 * @openapi
 * '/api/meetup/{userId}':
 *  post:
 *     tags:
 *     - Meetup (admin)
 *     summary: Create a meetup for user (by admin)
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of user(host of meetup)
 *        required: true
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
 *              $ref: '#/components/schema/MeetupResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 *      403:
 *        description: "Error: Permission denied"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNoPermission'
 */
router.post(
  '/meetup/:userId',
  [protectByRoles('ADMIN'), validateResource(createMeetupSchema)],
  meetupController.createMeetupByAdmin
)

/**
 * @openapi
 * '/api/meetup/{userId}/{meetupId}':
 *  patch:
 *     tags:
 *     - Meetup (admin)
 *     summary: Update a meetup for user (by admin)
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of user(host of meetup)
 *        required: true
 *      - name: meetupId
 *        in: path
 *        description: The id of the modifying meetup
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
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 *      403:
 *        description: "Error: Permission denied"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNoPermission'
 */
router.patch(
  '/meetup/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(updateMeetupSchema)],
  meetupController.updateMeetupByAdminById
)

/**
 * @openapi
 * '/api/meetup/{userId}/{meetupId}':
 *  delete:
 *     tags:
 *     - Meetup (admin)
 *     summary: Delete meetup by id for user (by admin)
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of user(host of meetup)
 *        required: true
 *      - name: meetupId
 *        in: path
 *        description: The id of the deleting meetup
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schema/Meetup'
 *       400:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupBadRequest'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 *       403:
 *         description: "Error: Permission denied"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNoPermission'
 *       404:
 *         description: "Error: Not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/MeetupNotFound'
 */
router.delete(
  '/meetups/:userId/:meetupId',
  [protectByRoles('ADMIN'), validateResource(deleteMeetupSchema)],
  meetupController.deleteMeetupByAdminById
)

export { router as meetupRouter }
