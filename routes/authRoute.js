import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import validate from '../utils/yupValidations.js';
import controller from '../controllers/authController.js';
import trimRequest from 'trim-request';

import schemas from '../validations/authValidations.js';
import passport from 'passport';

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
  .route('/update-password')
  .post(
    trimRequest.all,
    validate(schemas.updatePasswordSchema),
    isActiveUser,
    controller.resetPassword
  );

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: "/",
    successRedirect: "/",
    failureFlash: true,
    successFlash: "Successfully logged in!", 
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
export default router;
