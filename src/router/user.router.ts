import { Router } from 'express'
import { isAuthMiddleware } from '../middleware/isAuth.middleware'
const router = Router()


router.get('/users', isAuthMiddleware, userController.getUsers);

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/refresh', userController.refresh);


export { router as userRouter }
