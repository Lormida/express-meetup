import { Router } from 'express'
import userController from '../controllers/user.controller'

const router = Router()

/**
 * @openapi
 * '/api/users':
 *  get:
 *     tags:
 *     - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/UsersResponse'
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 */
router.get('/users', userController.getUsers)

export { router as userRouter }
