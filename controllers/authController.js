import bcryptjs from 'bcryptjs';
import {
    fetchUserFromEmailAndPassword,
    updatePassword,
    verifyCurrentPassword,
    verifyUserFromRefreshTokenPayload,
    createNewUser
  } from '../services/authService.js';
  import {
    generateAuthTokens,
    clearRefreshToken,
    verifyRefreshToken,
    generateAccessTokenFromRefreshTokenPayload,
  } from '../services/tokenService.js';
  
   
  const register = async (req, res, next) => {
    const {email, password} = req.body
    try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await createNewUser({
      email : email,
      password : hashedPassword
    });
    const tokens = await generateAuthTokens(newUser)
    res.json({user : newUser,tokens});
    } catch (error) {
      next(error);
    }
  };
  
   const login = async (req, res, next) => {
    try {
      const user = await fetchUserFromEmailAndPassword(req.body);
      const tokens = await generateAuthTokens(user);
      res.json({user,tokens});
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
  login, logout, refreshToken,  resetPassword, register
}