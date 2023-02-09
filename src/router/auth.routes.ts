import { Router } from 'express'
import authController from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource.middleware'
import { isAuth } from '../middleware/isAuth.middleware'
import { createUserSchema } from '../schema/user/user.schema'
import { loginUserSchema } from '../schema/auth/login.schema'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
const router = Router()

/**
 * @openapi
 * '/auth/refresh':
 *  get:
 *     tags:
 *     - Authorization
 *     summary: Update pair refresh & access token
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/AuthRefreshToken'
 *       401:
 *         description: "Error: Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotAuthorized'
 */
router.get('/refresh', authController.refresh)

/**
 * @openapi
 * '/auth/logout':
 *  post:
 *     tags:
 *     - Authorization
 *     summary: Logout from the account
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Some error during deleting refresh token
 */
router.post('/logout', isAuth, authController.logout)

/**
 * @openapi
 * '/auth/registration':
 *  post:
 *     tags:
 *     - Authorization
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schema/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserResponse'
 *      400:
 *        description: Bad request
 */
router.post('/registration', [validateResource(createUserSchema)], authController.registration('USER'))

/**
 * @openapi
 * '/auth/admin-registration':
 *  post:
 *     tags:
 *     - Authorization (admin)
 *     summary: Create a user with role admin
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schema/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserAdminResponse'
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
  '/admin-registration',
  [isAuth, protectByRoles('ADMIN'), validateResource(createUserSchema)],
  authController.registration('ADMIN')
)

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - Authorization
 *     summary: Login the system
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schema/LoginUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/UserResponse'
 *      400:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserWrongPassword'
 *      404:
 *         description: "Error: Bad request"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/UserNotFound'
 */
router.post('/login', [validateResource(loginUserSchema)], authController.login)

export { router as authRouter }
