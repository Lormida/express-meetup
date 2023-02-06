import { Router } from 'express'
import userController from '../controllers/user.controller';
import validateResource from '../middleware/validateResource.middleware'
import { isAuthMiddleware } from '../middleware/isAuth.middleware'
import { createUserSchema } from '../schema/user.schema';
import { loginUserSchema } from '../schema/login.schema';
const router = Router()


router.get('/api/users', /* isAuthMiddleware */ userController.getUsers);

router.get('/auth/refresh', isAuthMiddleware, userController.refresh);
router.post('/auth/logout', isAuthMiddleware, userController.logout);

router.post('/auth/registration',
  [validateResource(createUserSchema)],
  userController.registration
);
router.post('/auth/login',
  [validateResource(loginUserSchema)],
  userController.login
);



export { router as userRouter }
