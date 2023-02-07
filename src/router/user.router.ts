import { Router } from 'express'
import userController from '../controllers/user.controller'

const router = Router()

router.get('/users', userController.getUsers)

export { router as userRouter }
