import { Router } from 'express'
import authController from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource.middleware'
import { isAuth } from '../middleware/isAuth.middleware'
import { createUserSchema } from '../schema/user/user.schema'
import { loginUserSchema } from '../schema/auth/login.schema'
import { protectByRoles } from '../middleware/protectedByRole.middleware'
const router = Router()

router.get('/refresh', authController.refresh)

router.post('/logout', isAuth, authController.logout)
/* interface CreateUserInput {
  email: string
  name: string
  password: string
}

interface CreateUserResponse {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
} */
router.post('/registration', [validateResource(createUserSchema)], authController.registration('USER'))
router.post(
  '/admin-registration',
  [isAuth, protectByRoles('ADMIN'), validateResource(createUserSchema)],
  authController.registration('ADMIN')
)
router.post('/login', [validateResource(loginUserSchema)], authController.login)

export { router as authRouter }
