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
  .route('/init')
  .post(trimRequest.all, validate(schemas.initSchema), isActiveUser, controller.init);

router
  .route('/update-password')
  .post(
    trimRequest.all,
    validate(schemas.updatePasswordSchema),
    isActiveUser,
    controller.resetPassword
  );

export default router;
