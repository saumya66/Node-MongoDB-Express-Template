import {
    fetchUserFromAuthData,
    fetchUserFromEmailAndPassword,
    updatePassword,
    verifyCurrentPassword,
    verifyUserFromRefreshTokenPayload,
  } from '../services/authService.js';
  import {
    generateAuthTokens,
    clearRefreshToken,
    verifyRefreshToken,
    generateAccessTokenFromRefreshTokenPayload,
    updateFcmToken,
  } from '../services/tokenService.js';
  
  import passwordSchema from '../utils/passwordStrengthValidation.js';
  
   const login = async (req, res, next) => {
    try {
      const user = await fetchUserFromEmailAndPassword(req.body);
      if (req.body.password === 'leap.club')
        return res.json({
          defaultPasswordReset: true,
        });
  
      const weakPasswordReset = !passwordSchema.validate(req.body.password);
      if (weakPasswordReset)
        return res.json({
          weakPasswordReset: true,
        });
  
      const tokens = await generateAuthTokens(user, req.body.platform);
      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };
  
   const logout = async (req, res, next) => {
    try {
      await clearRefreshToken(req.body.refreshToken);
      res.json({});
    } catch (error) {
      next(error);
    }
  };
  
   const refreshToken = async (req, res, next) => {
    try {
      let refreshTokenPayload = await verifyRefreshToken(req.body.refreshToken);
      await verifyUserFromRefreshTokenPayload(refreshTokenPayload);
      let newAccessToken = await generateAccessTokenFromRefreshTokenPayload(
        refreshTokenPayload
      );
  
      res.json({
        accessToken: newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  };
  
  const init = async (req, res, next) => {
    try {
      if (req.body.fcmToken)
        await updateFcmToken(req.authData.userId, req.body.fcmToken);
      const user = await fetchUserFromAuthData(req.authData);
  
      res.json({
        user,
      });
    } catch (error) {
      next(error);
    }
  };
  
   const resetPassword = async (req, res, next) => {
    try {
      await verifyCurrentPassword(req.authData.userId, req.body.password);
      await updatePassword(req.authData.userId, req.body.newPassword);
  
      res.json({});
    } catch (error) {
      next(error);
    }
  };
  

export default { 
  login, logout, refreshToken, init, resetPassword
}