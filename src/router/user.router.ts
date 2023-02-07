import { Router } from 'express'
import userController from '../controllers/user.controller'
import { isAuth } from '../middleware/isAuth.middleware'

const router = Router()

router.get('/users', userController.getUsers)

export { router as userRouter }
