import { Router } from 'express'
import userController from '../controllers/user.controller';
import validateResource from '../middleware/validateResource.middleware'
import { isAuthMiddleware } from '../middleware/isAuth.middleware'
import { createUserSchema } from '../schema/user.schema';
import { loginUserSchema } from '../schema/login.schema';
const router = Router()


router.get('/users', isAuthMiddleware, userController.getUsers);
router.get('/refresh', isAuthMiddleware, userController.refresh);
router.post('/logout', isAuthMiddleware, userController.logout);

router.post('/registration',
  [validateResource(createUserSchema)],
  userController.registration
);
router.post('/login',
  [validateResource(loginUserSchema)],
  userController.login
);



export { router as userRouter }
