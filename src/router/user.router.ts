import { Router } from 'express'
import userController from '../controllers/user.controller'
import validateResource from '../middleware/validateResource.middleware'
import { isAuth } from '../middleware/isAuth.middleware'
import { createUserSchema } from '../schema/user.schema'
import { loginUserSchema } from '../schema/login.schema'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
const router = Router()

router.get('/auth/refresh', userController.refresh)

router.get('/api/users', isAuth, userController.getUsers)
router.post('/auth/logout', isAuth, userController.logout)

router.post('/auth/registration', [validateResource(createUserSchema)], userController.registration('USER'))
router.post(
  '/auth/admin-registration',
  [isAuth, protectByRoles('ADMIN'), validateResource(createUserSchema)],
  userController.registration('ADMIN')
)
router.post('/auth/login', [validateResource(loginUserSchema)], userController.login)

export { router as userRouter }
