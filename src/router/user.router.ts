import { Router } from 'express'
import userController from '../controllers/user.controller'
import { isAuth } from '../middleware/isAuth.middleware'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
import validateResource from '../middleware/validateResource.middleware'
import { getUserSchema, updateUserSchema } from '../schema/user/user.schema'

const router = Router()

router.use(isAuth)

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
 *              $ref: '#/components/schema/Users'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 */
router.get('/users', userController.getAllUsers)

/**
 * @openapi
 * '/api/user':
 *  get:
 *     tags:
 *     - User
 *     summary: Get an authorized user
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/UserResponse'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 */
router.get('/user', userController.getUser)

/**
 * @openapi
 * '/api/user':
 *  patch:
 *     tags:
 *     - User
 *     summary: Update an autorized user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schema/PatchUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserResponse'
 *      400:
 *        description: "Error: Bad request"
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 */
router.patch('/user', validateResource(updateUserSchema), userController.updateUser)

/**
 * @openapi
 * '/api/user':
 *  delete:
 *     tags:
 *     - User
 *     summary: Delete an autorized user
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserResponse'
 *      401:
 *        description: "Error: Unauthorized"
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserNotAuthorized'
 */
router.delete('/user', userController.deleteUser)

// Admin
/**
 * @openapi
 * '/api/user/{userId}':
 *  get:
 *     tags:
 *     - User (admin)
 *     summary: Get a user by id (by admin)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/UserResponse'
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
 *         description: "Error: User not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotFound'
 */
router.get('/user/:userId', [protectByRoles('ADMIN'), validateResource(getUserSchema)], userController.getUserById)

export { router as userRouter }
