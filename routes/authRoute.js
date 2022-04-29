import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import validate from '../utils/yupValidations.js';
import controller from '../controllers/authController.js';
import trimRequest from 'trim-request';

import schemas from '../validations/authValidations.js';

const router = express.Router();

router
  .route('/login')
  .post(trimRequest.all, validate(schemas.loginSchema), controller.login);

router
  .route('/logout')
  .post(trimRequest.all, validate(schemas.logoutSchema), controller.logout);

router
  .route('/refresh-token')
  .post(trimRequest.all, validate(schemas.refreshTokenSchema), controller.refreshToken);

router
  .route('/register')
  .post(trimRequest.all, validate(schemas.registerSchema), controller.register);

router
  .route('/reset-password')
  .post(
    trimRequest.all,
    validate(schemas.resetPasswordSchema),
    isActiveUser,
    controller.resetPassword
  );

router
  .route("/google-register")
  .post(
    trimRequest.all,
    validate(schemas.googleUserSchema),
    controller.googleUserRegister
  )

router
  .route("/google-login")
  .post(
    trimRequest.all,
    validate(schemas.googleUserSchema),
    controller.googleUserLogin
  )
 
export default router;
