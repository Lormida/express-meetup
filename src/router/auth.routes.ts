import { Router } from 'express'
import authController from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource.middleware'
import { isAuth } from '../middleware/isAuth.middleware'
import { createUserSchema } from '../schema/user.schema'
import { loginUserSchema } from '../schema/login.schema'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
const router = Router()

router.get('/refresh', authController.refresh)

router.post('/logout', isAuth, authController.logout)

router.post('/registration', [validateResource(createUserSchema)], authController.registration('USER'))
router.post(
  '/admin-registration',
  [isAuth, protectByRoles('ADMIN'), validateResource(createUserSchema)],
  authController.registration('ADMIN')
)
router.post('/login', [validateResource(loginUserSchema)], authController.login)

export { router as authRouter }
